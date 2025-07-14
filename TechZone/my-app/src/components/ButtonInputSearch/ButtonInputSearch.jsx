import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = '#fff',
    backgroundColorButton = '#000',         
    colorButton = '#FBEEC1'                
  } = props

  return (
    <div style={{ display: 'flex', background: '#fff' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{
          backgroundColor: backgroundColorInput,
          border: bordered === false ? 'none' : undefined,
          boxShadow: 'none',
          
        }}
        {...props}
      />
      <ButtonComponent
  size={size}
  onClick={props.onClick} // ✅ thêm dòng này
  styleButton={{
    background: backgroundColorButton,
    border: `1px solid ${colorButton}`,
    borderRadius: 0
  }}
  icon={<SearchOutlined style={{ color: colorButton }} />}
  textButton={textButton}
  styleTextButton={{ color: colorButton }}
/>

    </div>
  )
}

export default ButtonInputSearch
