import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form, Select, message, Alert } from 'antd';
import _ from 'lodash';

import Aux from '../../../hoc';
import cmConfig from '../../../CommonConfig';
import axios from '../../../axiosInst';
import DeptInfo from '../../Dumb/DeptInfo/DeptInfo';

import CuttingAvatar from '../../../assets/images/dept/tocat.jpg';
const Option = Select.Option;
const FormItem = Form.Item;

class PdfViewer extends Component {
    render() {
        return <embed src={this.props.pdfUrl} width={'100%'} height={'800'} />;
    }
};

class ViewReport extends Component {
    state = {
        fileDeptList: [],
        selectedFile: null
    }

    componentDidMount(){
        axios.get(`/api/cutting/listfolder`)
        .then((res) => {
            if(res.data.length > 0){
                message.success('Files found. Please select report file');
            }
            else{
                message.warning('No files found');
            }
            this.setState({fileDeptList: res.data});
        })
        .catch((err) => {
            console.log(err);
        });
    }

    
    
    handleFileChange = (value) => {
        this.setState({selectedFile: value});
    }

    render(){
        let optionReportFile = null;
        if(this.state.fileDeptList.length > 0){
            optionReportFile = this.state.fileDeptList.map((rec) => {
                return <Option value={rec.path} key={rec.name}>{rec.name}</Option>;
            });
        }
        
        return(
            <Aux>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <legend>View Cutting Report</legend>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <Row className="show-grid">
                            <Col xs={12} sm={2}>
                                <img src={CuttingAvatar} alt="Avatar" style={{maxWidth: "100%"}} />
                            </Col>
                            <Col xs={12} sm={4}>
                                <Row className="show-grid">
                                    <Col xs={12} sm={12}>
                                        <Alert
                                            message={`Cutting Contact Info`}
                                            description={
                                                <span>
                                                    <Row className="show-grid"><Col xs={12} sm={12}>Head of department: <b>Mr Phuong</b></Col></Row>
                                                    <Row className="show-grid"><Col xs={12} sm={12}>Email: <a href="mailto:vanphuong@ducthanh3.com.vn">vanphuong@ducthanh3.com.vn</a></Col></Row>
                                                    <Row className="show-grid"><Col xs={12} sm={12}>Mobile: 0123954756</Col></Row>
                                                </span>
                                            }
                                            type="info"
                                            showIcon
                                        />
                                    </Col>
                                </Row>
                                <Row className="show-grid" style={{marginTop: '5px'}}>
                                    <Col xs={12} sm={12}>
                                        <Alert
                                            description={
                                                <span>
                                                    <Row className="show-grid"><Col xs={12} sm={12}>Vice Head of department: <b>Ms Thuy An</b></Col></Row>
                                                    <Row className="show-grid"><Col xs={12} sm={12}>Email: <a href="mailto:thuyan@ducthanh3.com.vn">thuyan@ducthanh3.com.vn</a></Col></Row>
                                                    <Row className="show-grid"><Col xs={12} sm={12}>Mobile: 0978576982</Col></Row>
                                                </span>
                                            }
                                            type="info"
                                            showIcon
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <Form layout="inline">
                            <FormItem label="Choose report file">
                                <Select
                                    showSearch
                                    style={{ width: 350 }}
                                    placeholder = "Select report file"
                                    optionFilterProp = "children"
                                    
                                    onSelect = {this.handleFileChange}
                                    filterOption = {(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {optionReportFile}
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Row className="show-grid">
                    {this.state.selectedFile !== null ? <iframe src={`${cmConfig.baseURL + 'pdf/viewer.html?file='+ _.replace(this.state.selectedFile,'upload\\','..\\')}`} width="100%" height="600px" /> : null }
                </Row>
            </Aux>
        );
    }
}

export default ViewReport;