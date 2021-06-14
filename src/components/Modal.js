import React from 'react';
import {Modal, Button} from 'antd';
import 'antd/dist/antd.css';
import {Input} from 'antd';

const {TextArea} = Input;

const EditModal = ({visible, handleCancel, handleOk}) => {
  console.log(visible)
  return (
    <Modal footer={[
      <Button key="back" onClick={handleCancel}>
        Close
      </Button>,
      <Button key="submit" type="danger"  onClick={handleOk}>
        Delete
      </Button>,
      <Button
      >
        Save
      </Button>,
    ]} title="Basic Modal" visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <TextArea value="Annotation here"/>
    </Modal>
  );
};

export default EditModal;
