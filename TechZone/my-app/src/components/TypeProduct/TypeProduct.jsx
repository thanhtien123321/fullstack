import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TypeCard = styled.div`
  padding: 10px 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }
`;

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/type/${name}`);
  };

  return <TypeCard onClick={handleClick}>{name}</TypeCard>;
};

export default TypeProduct;
