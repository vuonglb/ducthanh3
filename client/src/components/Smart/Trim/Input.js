import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form, Select, message } from 'antd';
import _ from 'lodash';

import Aux from '../../../hoc';
import cmConfig from '../../../CommonConfig';
import axios from '../../../axiosInst';
import DeptInfo from '../../Dumb/DeptInfo/DeptInfo';

import TrimAvatar from '../../../assets/images/avatar-placeholder.png';

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
        axios.get(`/api/trim/input`)
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

    handleFileFocus = (value) => {
        this.setState({selectedFile: null});
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
                        <legend>View Trim Input Report</legend>
                    </Col>
                </Row>
                <Row className="show-grid">
                    <Col xs={12} sm={12}>
                        <DeptInfo 
                            title="Trim"
                            avatar={TrimAvatar}
                            head = "Ms Dinh"
                            email = "huynhdinh@ducthanhti.com.vn"
                        />
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
                                    onFocus = {this.handleFileFocus}
                                    onSelect = {this.handleFileChange}
                                    filterOption = {(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                    {optionReportFile}
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Row className="show-grid">
                    {this.state.selectedFile !== null ? <PdfViewer pdfUrl={`${cmConfig.baseURL + _.replace(this.state.selectedFile,'upload/','')}`} /> : null }
                </Row>
            </Aux>
        );
    }
}

export default ViewReport;