import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Upload, message } from 'antd';
import FontAwesome from 'react-fontawesome';

import Aux from '../../../hoc';
import cmConfig from '../../../CommonConfig';

const Dragger = Upload.Dragger;

class UploadFile extends Component {
    render(){
        const uploadProps = {
            name: 'cuttingFile',
            accept: '.xlsx',
            multiple: false,
            action: `${cmConfig.baseURL}api/upload/cutting`,
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            onChange: (info) => {
              const res = info.file.response;
              const status = info.file.status;
              if (status === 'done') {
                message.success(res);
              }
              else if (status === 'error') {
                message.error(res);
              }
            }
        };
        return(
            <Aux>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <legend>Upload File</legend>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={4} smOffset={4}>
                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <FontAwesome name="upload" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single file upload.</p>
                        </Dragger>
                    </Col>
                </Row>
            </Aux>
        );
    }
}

export default UploadFile;