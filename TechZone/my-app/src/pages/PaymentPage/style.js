import styled from 'styled-components';

export const WrapperLeft = styled.div`
  flex: 1;
  padding-right: 20px;
`;

export const WrapperRight = styled.div`
  width: 300px;
`;

export const WrapperStyleHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
`;

export const WrapperPriceDiscount = styled.span`
  font-size: 13px;
  color: #999;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const WrapperInfo = styled.div`
  display: flex;
  flex-direction: column;
`;


export const WrapperQualityProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
