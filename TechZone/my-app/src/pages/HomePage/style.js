import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
export const WrapperTypeProduct = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;



export const WrapperButtonMore = styled(ButtonComponent)`
&:hover {
  color : #fff;
  background : rgb(13 , 92 , 182);
  span {
    color : #fff
  }
  width : 100%;
  text-align : center;
}`
export const WrapperProducts = styled.div`
display: flex ;
gap : 14px;
margin-top : 20px;
flex-wrap : wrap`
