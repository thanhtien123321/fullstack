import { Row } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
  padding: 10px 0;
  background-color: #000;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  width: 1270px;
`

export const WrapperTextHeader = styled.span`
  font-size: 18px;
  color: #FBEEC1; //
  font-weight: bold;
  text-align: left;
`

export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #FBEEC1;
  gap: 10px;
`

export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: #FBEEC1;
  white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
cursor : pointer;
&:hover {
  color: #FBEEC1; 
}
`
