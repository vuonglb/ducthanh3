import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form, Select, message, Radio } from 'antd';
import _ from 'lodash';

import Aux from '../../../hoc';
import cmConfig from '../../../CommonConfig';
import axios from '../../../axiosInst';
import DeptInfo from '../../Dumb/DeptInfo/DeptInfo';

import AdministrationAvatar from '../../../assets/images/dept/Admin.jpg';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

class PdfViewer extends Component {
    render() {
        return <embed src={this.props.pdfUrl} width={'100%'} height={'800'} />;
    }
};

class ViewReport extends Component {
    state = {
        dept: '',
        fileDeptList: [],
        selectedFile: null
    }

    handleDeptChange = (event) => {
        let value = event.target.value;
        this.setState({dept: value});
        axios.get(`/api/administration/listfolder/${value}`)
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
                        <legend>View HR Report</legend>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <DeptInfo 
                            title="Administration"
                            avatar={AdministrationAvatar}
                            head = "Ms Khanh Pham"
                            email = "bangkhanh@ducthanh3.com.vn"
                            mobile = "01213675675"
                        />
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <Form layout="vertical">
                            <FormItem label="Choose report type">
                                <RadioGroup onChange={this.handleDeptChange} value={this.state.dept}>
                                    <Radio value="HR">HR Report</Radio>
                                    <Radio value="AD">Admin Report</Radio>
                                    <Radio value="ME">Meeting Report</Radio>
                                </RadioGroup>
                            </FormItem>
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