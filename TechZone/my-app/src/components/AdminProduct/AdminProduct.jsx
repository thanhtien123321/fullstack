import React, { useState, useEffect } from 'react';
import { getBase64 } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import { WrapperHeader, WrapperUploadFile } from './style';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Select , AutoComplete } from 'antd';
import { convertPrice } from '../../utils';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as ProductService from '../../services/ProductService';
import * as message from '../../components/Message/Message';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';

const IMG_URL = process.env.REACT_APP_IMAGE_URL;

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [formDrawer] = Form.useForm();

  const [stateProduct, setStateProduct] = useState({
    name: '', price: '', description: '', rating: '', image: null, type: '', countInStock: ''
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '', price: '', description: '', rating: '', image: null, type: '', countInStock: ''
  });

  const mutationCreate = useMutationHooks((formData) => ProductService.createProduct(formData));
  const mutationUpdate = useMutationHooks(({ id, formData }) => ProductService.updateProduct(id, formData));
  const mutationDelete = useMutationHooks((id) => ProductService.deleteProduct(id));
  const mutationDeleteMany = useMutationHooks((ids) => ProductService.deleteManyProduct(ids));

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res?.status === 'ok' ? res.data : [];
  };

  const { isLoading, data: products, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  const uniqueTypes = [...new Set(products?.map(p => p.type).filter(Boolean))];

  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate(ids, {
      onSuccess: (res) => {
        res?.status === 'ok' ? message.success('Xoá thành công') : message.error(res?.message || 'Xoá thất bại');
        refetch();
      },
      onError: () => message.error('Xoá thất bại')
    });
  };

  const handleOnchange = (e) => setStateProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleOnchangeDetails = (e) => setStateProductDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOnchangeAvatar = async ({ file }) => {
    if (!file.preview) file.preview = await getBase64(file.originFileObj);
    setStateProduct(prev => ({ ...prev, image: file.preview, imageFile: file.originFileObj }));
  };

  const handleOnchangeAvatarDetails = async ({ file }) => {
    if (!file.preview) file.preview = await getBase64(file.originFileObj);
    setStateProductDetails(prev => ({ ...prev, image: file.preview, imageFile: file.originFileObj }));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({ name: '', price: '', description: '', rating: '', image: null, type: '', countInStock: '' });
  };

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setRowSelected('');
    formDrawer.resetFields();
    setStateProductDetails({ name: '', price: '', description: '', rating: '', image: null, type: '', countInStock: '' });
  };

  const onFinishCreate = () => {
    const { name, price, description, rating, imageFile, type, countInStock } = stateProduct;
    if (!name || !price || !description || !rating || !imageFile || !type || !countInStock) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('rating', rating);
    formData.append('type', type);
    formData.append('countInStock', countInStock);
    formData.append('image', imageFile);

    mutationCreate.mutate(formData, {
      onSuccess: (res) => {
        res?.status === 'ok' ? message.success('Tạo sản phẩm thành công') : message.error('Tạo thất bại');
        handleCancel();
        refetch();
      },
      onError: () => message.error('Tạo thất bại')
    });
  };

  const onFinishUpdate = () => {
    const { name, price, description, rating, imageFile, type, countInStock } = stateProductDetails;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('rating', rating);
    formData.append('type', type);
    formData.append('countInStock', countInStock);
    if (imageFile) formData.append('image', imageFile);

    mutationUpdate.mutate({ id: rowSelected, formData }, {
      onSuccess: (res) => {
        res?.status === 'ok' ? message.success('Cập nhật thành công') : message.error('Cập nhật thất bại');
        handleCloseDrawer();
        refetch();
      },
      onError: () => message.error('Cập nhật thất bại')
    });
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(rowSelected, {
      onSuccess: (res) => {
        res?.status === 'ok' ? message.success('Xoá thành công') : message.error('Xoá thất bại');
        setIsModalOpenDelete(false);
        refetch();
      },
      onError: () => message.error('Xoá thất bại')
    });
  };

  const fetchProductDetails = async (id) => {
    const res = await ProductService.getDetailsProduct(id);
    if (res?.data) setStateProductDetails({ ...res.data, imageFile: null });
  };

  useEffect(() => {
    if (rowSelected) fetchProductDetails(rowSelected);
  }, [rowSelected]);

  useEffect(() => {
    formDrawer.setFieldsValue(stateProductDetails);
  }, [stateProductDetails]);

  const renderAction = (record) => (
    <div>
      <DeleteOutlined style={{ color: 'red', fontSize: 22, cursor: 'pointer' }} onClick={() => {
        setRowSelected(record._id);
        setIsModalOpenDelete(true);
      }} />
      <EditOutlined style={{ color: 'green', fontSize: 22, marginLeft: 12, cursor: 'pointer' }} onClick={() => {
        setRowSelected(record._id);
        setIsOpenDrawer(true);
      }} />
    </div>
  );

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price) => convertPrice(Number(price))
    },
    
    { title: 'Đánh giá', dataIndex: 'rating' },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Hành động', render: (_, record) => renderAction(record) },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (url) =>
        url ? (
          <img
            src={url.startsWith('http') ? url : `${IMG_URL}${url}`}
            alt="product"
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
          />
        ) : 'Không có'
    },
  ];

  const dataTable = Array.isArray(products) ? products.map(p => ({ ...p, key: p._id })) : [];

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>Thêm sản phẩm</Button>
      <TableComponent
        columns={columns}
        isLoading={isLoading}
        data={dataTable}
        handleDeleteManyProduct={handleDeleteManyProduct}
      />

      {/* Modal tạo sản phẩm */}
      <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form onFinish={onFinishCreate}>
          <Form.Item label="Tên">
            <InputComponent name="name" value={stateProduct.name} onChange={handleOnchange} />
          </Form.Item>
          <Form.Item label="Loại sản phẩm">
  <AutoComplete
    style={{ width: '100%' }}
    placeholder="Chọn hoặc nhập loại"
    value={stateProduct.type}
    options={uniqueTypes.map(type => ({ value: type }))}
    onChange={(value) =>
      setStateProduct(prev => ({ ...prev, type: value }))
    }
    filterOption={(inputValue, option) =>
      option.value.toLowerCase().includes(inputValue.toLowerCase())
    }
  />
</Form.Item>
          {['countInStock', 'price', 'description', 'rating'].map(field => (
            <Form.Item key={field} label={field}>
              <InputComponent name={field} value={stateProduct[field]} onChange={handleOnchange} />
            </Form.Item>
          ))}
          <Form.Item label="Ảnh">
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button>Chọn ảnh</Button>
              {stateProduct.image && (
                <img
                  src={stateProduct.image.startsWith('http') ? stateProduct.image : `${IMG_URL}${stateProduct.image}`}
                  alt=""
                  style={{ width: 60, height: 60, marginLeft: 10 }}
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Tạo</Button>
          </Form.Item>
        </Form>
      </ModalComponent>

      {/* Modal xoá */}
      <ModalComponent title="Xoá sản phẩm" open={isModalOpenDelete} onCancel={() => setIsModalOpenDelete(false)} onOk={handleDeleteProduct}>
        Bạn có chắc chắn muốn xoá sản phẩm này không?
      </ModalComponent>

      {/* Drawer chỉnh sửa */}
      <DrawerComponent title="Chỉnh sửa sản phẩm" isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="60%">
        <Form form={formDrawer} onFinish={onFinishUpdate}>
          <Form.Item label="Tên" name="name">
            <InputComponent name="name" value={stateProductDetails.name} onChange={handleOnchangeDetails} />
          </Form.Item>
          <Form.Item label="Loại sản phẩm" name="type">
  <Select
    mode="combobox"
    style={{ width: '100%' }}
    placeholder="Chọn hoặc nhập loại"
    value={stateProductDetails.type}
    onChange={(value) => setStateProductDetails(prev => ({ ...prev, type: value }))}
    options={uniqueTypes.map(type => ({ label: type, value: type }))}
  />
</Form.Item>

          {['countInStock', 'price', 'description', 'rating'].map(field => (
            <Form.Item key={field} label={field} name={field}>
              <InputComponent name={field} value={stateProductDetails[field]} onChange={handleOnchangeDetails} />
            </Form.Item>
          ))}
          <Form.Item label="Ảnh">
            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
              <Button>Chọn ảnh</Button>
              {stateProductDetails.image && (
                <img
                  src={stateProductDetails.image.startsWith('http')
                    ? stateProductDetails.image
                    : `${IMG_URL}${stateProductDetails.image}`}
                  alt="preview"
                  style={{ width: 60, height: 60, marginLeft: 10, objectFit: 'cover', borderRadius: 8 }}
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Cập nhật</Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
    </div>
  );
};

export default AdminProduct;
