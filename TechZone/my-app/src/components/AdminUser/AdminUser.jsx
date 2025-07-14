import React, { useState } from 'react';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Form, Upload } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';

import * as message from '../../components/Message/Message';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { getBase64 } from '../../utils';
import { updateUser } from '../../redux/slides/userSlide';
import { WrapperHeader } from './style';

const IMG_URL = process.env.REACT_APP_IMAGE_URL || "http://localhost:3001";

const AdminUser = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [formDrawer] = Form.useForm();
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isModalOpenDeleteMany, setIsModalOpenDeleteMany] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const mutationCreate = useMutationHooks(({ data }) => UserService.createUser(data));
  const mutationUpdate = useMutationHooks(({ id, data }) => UserService.updateUser(id, data));
  const mutationDelete = useMutationHooks(({ id }) => UserService.deleteUser(id));
  const mutationDeleteMany = useMutationHooks((data) => UserService.deleteManyUser(data));

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(currentUser?.access_token);
    return res?.status === 'ok' ? res.data : [];
  };

  const { isLoading: isLoadingUsers, data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setRowSelected('');
    formDrawer.resetFields();
    setAvatarPreview('');
    setAvatarFile(null);
  };

  const handleUploadAvatar = async ({ file, fileList }) => {
    const originFile = file.originFileObj || fileList?.[0]?.originFileObj;
    if (!originFile) return;
    const preview = await getBase64(originFile);
    setAvatarPreview(preview);
    setAvatarFile(originFile);
  };

  const onFinish = (values) => {
    const formData = new FormData();

    if (!rowSelected) {
      const { password, confirmPassword, ...rest } = values;
      if (password !== confirmPassword) {
        return message.error('Mật khẩu xác nhận không khớp!');
      }
      for (let key in rest) formData.append(key, rest[key]);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
    } else {
      for (let key in values) formData.append(key, values[key]);
    }

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    if (rowSelected) {
      mutationUpdate.mutate({ id: rowSelected, data: formData }, {
        onSuccess: (res) => {
          if (res?.status === 'ok') {
            message.success('Cập nhật người dùng thành công');

            // 🟡 Nếu đang sửa chính mình thì cập nhật Redux
            if (rowSelected === currentUser.id) {
              dispatch(updateUser({
                ...res.data,
                access_token: currentUser.access_token
              }));
            }

            queryClient.invalidateQueries(['users']);
            handleCloseDrawer();
          } else {
            message.error('Cập nhật thất bại');
          }
        },
      });
    } else {
      mutationCreate.mutate({ data: formData }, {
        onSuccess: (res) => {
          res?.status === 'OK'
            ? message.success('Tạo người dùng thành công')
            : message.error(res?.message || 'Tạo thất bại');
          handleCloseDrawer();
        },
        onSettled: () => queryClient.invalidateQueries(['users']),
      });
    }
  };

  const handleDeleteUser = () => {
    setIsModalOpenDelete(false);
    mutationDelete.mutate({ id: rowSelected }, {
      onSuccess: (res) => {
        res?.status === 'OK'
          ? message.success('Xóa người dùng thành công')
          : message.error('Xóa thất bại');
        setRowSelected('');
      },
      onSettled: () => queryClient.invalidateQueries(['users']),
    });
  };

  const handleDeleteMany = () => {
    setIsModalOpenDeleteMany(false);
    if (selectedRowKeys.length === 0) return message.warning('Bạn chưa chọn người dùng nào');
    mutationDeleteMany.mutate(selectedRowKeys, {
      onSuccess: (res) => {
        res?.status === 'OK'
          ? message.success('Đã xóa nhiều người dùng')
          : message.error(res?.message || 'Xóa thất bại');
        setSelectedRowKeys([]);
      },
      onSettled: () => queryClient.invalidateQueries(['users']),
    });
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      render: (url) =>
        url ? (
          <img
            src={`${IMG_URL}${url}`}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
        ) : (
          'Không có'
        ),
    },
    {
      title: 'Quyền',
      dataIndex: 'isAdmin',
      render: (val) => (val ? 'Admin' : 'User'),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <>
          <DeleteOutlined
            style={{ color: 'red', fontSize: 22, cursor: 'pointer' }}
            onClick={() => {
              setRowSelected(record._id);
              setIsModalOpenDelete(true);
            }}
          />
          <EditOutlined
            style={{ color: 'green', fontSize: 22, marginLeft: 12, cursor: 'pointer' }}
            onClick={() => {
              setRowSelected(record._id);
              formDrawer.setFieldsValue({ ...record });
              setAvatarPreview(record.avatar ? `${IMG_URL}${record.avatar}` : '');
              setAvatarFile(null);
              setIsOpenDrawer(true);
            }}
          />
        </>
      ),
    },
  ];

  const dataTable = Array.isArray(users)
    ? users.map((user) => ({ ...user, key: user._id }))
    : [];

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setRowSelected('');
            formDrawer.resetFields();
            setAvatarPreview('');
            setIsOpenDrawer(true);
          }}
          style={{ marginRight: 10 }}
        >
          Thêm người dùng
        </Button>
        <Button
          danger
          onClick={() => setIsModalOpenDeleteMany(true)}
          disabled={selectedRowKeys.length === 0}
        >
          Xóa nhiều
        </Button>
      </div>

      <TableComponent
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
        }}
        columns={columns}
        isLoading={isLoadingUsers}
        data={dataTable}
      />

      <ModalComponent
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={() => setIsModalOpenDelete(false)}
        onOk={handleDeleteUser}
      >
        Bạn muốn xóa người dùng này không?
      </ModalComponent>

      <ModalComponent
        title="Xóa nhiều người dùng"
        open={isModalOpenDeleteMany}
        onCancel={() => setIsModalOpenDeleteMany(false)}
        onOk={handleDeleteMany}
      >
        Bạn muốn xóa các người dùng đã chọn không?
      </ModalComponent>

      <DrawerComponent
        title={rowSelected ? 'Chỉnh sửa người dùng' : 'Tạo người dùng'}
        isOpen={isOpenDrawer}
        onClose={handleCloseDrawer}
        width="60%"
      >
        <Form
          form={formDrawer}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
        >
          {['name', 'email', 'phone'].map((field) => (
            <Form.Item
              key={field}
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              rules={[{ required: true, message: `${field} là bắt buộc` }]}
            >
              <InputComponent type="text" />
            </Form.Item>
          ))}

          {!rowSelected && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Password là bắt buộc' }]}
              >
                <InputComponent type="password" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[{ required: true, message: 'Xác nhận mật khẩu là bắt buộc' }]}
              >
                <InputComponent type="password" />
              </Form.Item>
            </>
          )}

          <Form.Item label="Ảnh đại diện">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Upload
                onChange={handleUploadAvatar}
                maxCount={1}
                showUploadList={false}
                beforeUpload={() => false}
              >
                <Button>Chọn ảnh</Button>
              </Upload>

              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  style={{ width: 60, height: 60, marginLeft: 10 }}
                />
              )}
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              {rowSelected ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
    </div>
  );
};

export default AdminUser;
