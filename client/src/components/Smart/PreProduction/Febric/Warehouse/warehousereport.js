import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ExcelFileSheet from 'react-data-export';

import { Radio, AutoComplete, Input, InputNumber, Form, Button, Tabs, DatePicker, Select } from 'antd';
import ReactDataGrid from 'react-data-grid';

import RowRenderer from './rowrenderer';
import DateFormatter from './dateformatter';
import PropTypes from 'prop-types';
import moment from 'moment';

import axios from '../../../../../axiosInst';
const RadioGroup = Radio.Group;
const Option = Select.Option;

const FormItem = Form.Item;
//const Option = Select.Option;
//const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;
const { Editors } = require('react-data-grid-addons');
const { ExcelFile, ExcelSheet } = ExcelFileSheet;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const { AutoComplete: AutoCompleteEditor } = Editors;
const { DateLongFormatter, DateShortFormatter } = DateFormatter;

const dateFormat = 'MM/DD/YYYY';

const import_columns = [
    { key: 'inputdate_no', name: 'DATE', formatter: DateShortFormatter },
    { key: 'invoice_no', name: 'INVOICE #' },
    { key: 'orderid', name: 'ORDER #' },
    { key: 'provider_name', name: 'SUPPLIER' },
    { key: 'fabric_type', name: 'CODE' },
    { key: 'fabric_color', name: 'COLOR' },
    { key: 'met', name: 'MET' },
    { key: 'roll', name: 'ROLL' },
    { key: 'declare_no', name: 'STK' },
    { key: 'declare_date', name: 'STK DATE', formatter: DateShortFormatter },
];

const export_columns = [
    { key: 'inputdate_no', name: 'DATE', formatter: DateShortFormatter },
    { key: 'orderid', name: 'ORDER #' },
    { key: 'fabric_type', name: 'CODE' },
    { key: 'fabric_color', name: 'COLOR' },
    { key: 'met', name: 'MET' },
    { key: 'roll', name: 'ROLL' },
    { key: 'po_no', name: 'PO#' },
    { key: 'line_no', name: 'LINE#' },
    { key: 'sku', name: 'SKU' },
    { key: 'des', name: 'DESCRIPTION' },
    { key: 'qty', name: 'QTY' },
    { key: 'yield', name: 'YIELD' },
    { key: 'fab_qty', name: 'FAB_QTY' },
    { key: 'note', name: 'NOTE' }
];

const inventory_colums = [
    { key: 'fabric_type', name: 'CODE' },
    { key: 'fabric_color', name: 'COLOR' },
    { key: 'met', name: 'MET' },
    { key: 'roll', name: 'ROLL' },
]
class Inventory extends Component {
    state = {
        data_colors: [],
        data_types: [],
        show_grid_result: false,
        data_inventory: []
    }
    handleSearchInventory = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('handleSearchInventory -> Received values of form: ', values);
            axios.get('api/fabric/warehouse/getinventorys', { params: values })
                .then((res) => {
                    console.log(res.data);
                    this.setState({ data_inventory: res.data });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ data_inventory: [] });
                });
            this.setState({ show_grid_result: true });
        });
    }
    handleInventoryReset = () => {
        console.log('handleInventoryReset -> clicked');
        this.props.form.resetFields();
        this.setState({ show_grid_result: false });
    }
    handleColorChange = (value) => { console.log(`selected ${value}`); }

    handleTypeChange = (value) => { console.log(`selected ${value}`); }

    inventoryDataset = () => {
        return [];
    }

    rowInventoryGetter = (i) => {
        if (i >= 0 && i < this.state.data_inventory.length) {
            return this.state.data_inventory[i];
        }
        return null;
    }

    loadFabricColors = () => {
        axios.get('api/fabric/color/get', { params: {} })
            .then((res) => {
                let colors = res.data;
                let colors_grid = [];
                let data_uni = [];
                for (let i = 0; i < colors.length; i++) {
                    if (data_uni.indexOf(colors[i].fabriccolor_name) === -1) {
                        colors_grid.push(<Option key={colors[i].fabriccolor_name}> {colors[i].fabriccolor_name}</Option>);
                        data_uni.push(colors[i].fabriccolor_name);
                    }
                }
                this.setState({ data_colors: colors_grid });

            })
            .catch((err) => {
                this.setState({ data_colors: [] });
            });

    }

    loadFabricTypes = () => {
        console.log('loadFabricTypes');
        axios.get('api/fabric/type/get', { params: {} })
            .then((res) => {
                let data = res.data;
                let children = []
                let data_uni = []
                for (let i = 0; i < data.length; i++) {
                    if (data_uni.indexOf(data[i].fabrictype_name) === -1) {
                        children.push(<Option key={data[i].fabrictype_name}> {data[i].fabrictype_name} </Option>);
                        data_uni.push(data[i].fabrictype_name);
                    }
                }
                this.setState({ data_types: children });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ data_types: [] });
            });

    }

    componentDidMount = () => {
        this.loadFabricColors();
        this.loadFabricTypes();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form className="ant-advanced-search-panel " onSubmit={this.handleSearchInventory}>
                    <Grid>
                        <Row className="show-grid">
                            <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                                <FormItem label={'COLOR '}>{
                                    getFieldDecorator('fabric_color', {})(<Select mode='tags' style={{ width: '100%' }} tokenSeparators={[',']} onChange={this.handleColorChange}>{this.state.data_colors}</Select>)
                                }
                                </FormItem>
                            </Col>
                            <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                                <FormItem label={'TYPE '}>{
                                    getFieldDecorator('fabric_type', {})(<Select mode='tags' style={{ width: '100%' }} tokenSeparators={[',']} onChange={this.handleTypeChange}>{this.state.data_types}</Select>)
                                }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                                <Button type="primary" htmlType="submit">SEARCH</Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleInventoryReset}>CLEAR</Button>
                            </Col>
                        </Row>
                    </Grid>
                </Form>
                {this.state.show_grid_result === true ? (
                    <div>
                        <ExcelFile element={<Button>Download Data</Button>} filename={"Inventory - " + moment().format('MM/DD/YYYY h:mm:ss')}>
                            <ExcelSheet dataSet={this.inventoryDataset()} name="Inventory" />
                        </ExcelFile>
                        <ReactDataGrid
                            enableCellSelect={true}
                            resizable={true}
                            columns={inventory_colums}
                            rowGetter={this.rowInventoryGetter}
                            rowsCount={this.state.data_inventory.length}
                            minHeight={290}
                            rowRenderer={RowRenderer}
                        ></ReactDataGrid>
                    </div>
                ) : null}
            </div>
        );
    }
}

class Imports extends Component {
    state = {
        data_import: [],
        data_providers: [],
        si_data: {
            si_from_date: undefined,
            si_to_date: undefined,
            si_from_order: undefined,
            si_to_order: undefined,
            si_suppiler: undefined,
            si_type: undefined,
            si_color: undefined
        },
    }

    loadProviders = (v) => {
        axios.get('api/fabric/provider/get', { params: {} })
            .then((res) => {
                let data = res.data;
                let children = []
                let children_uni = []
                for (let i = 0; i < data.length; i++) {
                    if (data[i].provider_code && children_uni.indexOf(data[i].provider_code) === -1) {
                        children.push(<Option key={data[i].provider_code}>{data[i].provider_code}</Option>);
                        children_uni.push(data[i].provider_code);
                    }
                }
                this.setState({
                    data_providers: children_uni,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ data_providers: [] });
            });
    }

    handleImportReset = () => {
        this.props.form.resetFields();
    }
    rowImportGetter = (i) => {
        if (i >= 0 && i < this.state.data_import.length) {
            return this.state.data_import[i];
        }
        return null;
    };
    handleSearchImport = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            let si_from_date = '';
            if (values.from_date) { si_from_date = values.from_date.format(dateFormat); }

            let si_to_date = '';
            if (values.to_date) { si_to_date = values.to_date.format(dateFormat); }

            let si_from_order = '';
            if (values.order_from) { si_from_order = values.order_from; }

            let si_to_order = '';
            if (values.order_to) { si_to_order = values.order_to; }

            let si_suppiler = '';
            if (values.provider_name) { si_suppiler = values.provider_name; }

            let si_type = '';
            if (values.fabrictype_name) { si_type = values.fabrictype_name; }

            let si_color = '';
            if (values.fabriccolor_name) { si_color = values.fabriccolor_name; }

            //////update params
            if (values.from_date) {
                values.from_date = values.from_date.format('YYYY-MM-DD');
            }

            if (values.to_date) {
                values.to_date = values.to_date.add(1, 'days').format('YYYY-MM-DD');
            }

            axios.get('api/fabric/warehouse/getimports', { params: values })
                .then((res) => {

                    this.setState({
                        si_data: {
                            si_from_date,
                            si_to_date,
                            si_from_order,
                            si_to_order,
                            si_suppiler,
                            si_type,
                            si_color
                        }
                    });

                    console.log(this.state.si_data);
                    let data = [];
                    for (let i = 0; i < res.data.length; i++) {
                        let row = res.data[i];
                        for (let j = 0; j < row.details.length; j++) {
                            let detail = row.details[j];
                            data.push({
                                inputdate_no: row.inputdate_no,
                                invoice_no: row.invoice_no,
                                provider_name: row.provider_name,
                                declare_no: row.declare_no,
                                declare_date: row.declare_date,

                                orderid: detail.orderid,
                                fabric_type: detail.fabric_type,
                                fabric_color: detail.fabric_color,
                                met: detail.met,
                                roll: detail.roll
                            });
                        }
                    }
                    this.setState({ data_import: data });
                    // console.log(JSON.stringify(res));
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ data_import: [] });
                });

        });
    }


    importDataset = () => {
        let dataset = [];
        dataset.push({
            xSteps: 2,
            ySteps: 0,
            columns: ['BÁO CÁO NHẬP VẢI'],
            data: [[]]
        });

        let conditions = {
            xSteps: 0,
            ySteps: 0,
            columns: ['', '', '', '', '']

        };

        let si_data = this.state.si_data;

        let conditions_data = [];
        conditions_data.push(['FROM DATE', si_data.si_from_date, '', 'TO DATE', si_data.si_to_date]);
        conditions_data.push(['FROM ORDER #', si_data.si_from_order, '', 'TO ORDER #', si_data.si_to_order]);
        conditions_data.push(['SUPPILER', si_data.si_suppiler, '', 'CODE', si_data.si_type]);
        conditions_data.push(['COLOR', si_data.si_color, '', '', '']);

        conditions.data = conditions_data;
        dataset.push(conditions);

        let data = {
            xSteps: 0,
            ySteps: 2,
            columns: ['DATE', 'ORDER #', 'INVOICE #', 'SUPPLIER', 'CODE', 'COLOR', 'MET', 'ROLL', 'STK', 'NOTE'],
        }

        let data_row = [];
        for (let i = 0; i < this.state.data_import.length; i++) {
            let row = [];
            let r = this.state.data_import[i];
            let d = moment(r.inputdate_no);
            row.push(d.format('MM/DD/YYYY'));
            row.push(r.orderid);
            row.push(r.invoice_no);
            row.push(r.provider_name);
            row.push(r.fabric_type);
            row.push(r.fabric_color);
            row.push(r.met);
            row.push(r.roll);
            row.push(r.declare_no);
            row.push(r.note);

            data_row.push(row);
        }
        data.data = data_row;
        dataset.push(data);

        console.log('export 1 complete');
        return dataset;
    }


    componentDidMount = () => {
        this.loadProviders({});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { size } = 'default';
        return (<div>
            <Form className="ant-advanced-search-panel " onSubmit={this.handleSearchImport}>
                <Grid>
                    <Row className="show-grid">
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'FROM ORDER #'}>{
                                getFieldDecorator('order_from', {})(<InputNumber name='order_from' placeholder="from order no" />)
                            }
                            </FormItem>
                            <FormItem label={'TO ORDER #'}>{
                                getFieldDecorator('order_to', {})(<InputNumber name='order_to' placeholder="to oder no" />)
                            }
                            </FormItem>
                        </Col>
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'FROM DATE'}>{
                                getFieldDecorator('from_date', {})(<DatePicker size={size} format={dateFormat} />)
                            }
                            </FormItem>
                            <FormItem label={'TO DATE'}>{
                                getFieldDecorator('to_date', {})(<DatePicker size={size} format={dateFormat} />)
                            }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'SUPPILERS'}>{
                                getFieldDecorator('provider_name', {})(<AutoComplete placeholder='nhà cung cấp' dataSource={this.state.data_providers}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                />)
                            }

                            </FormItem>
                            <FormItem label={'COLOR '}>{
                                getFieldDecorator('fabric_color', {})(<AutoComplete placeholder='màu vải' dataSource={this.state.data_colors}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                ></AutoComplete>)
                            }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'TYPE '}>{
                                getFieldDecorator('fabric_type', {})(<AutoComplete placeholder='loại vải' dataSource={this.state.data_types}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                ></AutoComplete>)
                            }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                            <Button type="primary" htmlType="submit">SEARCH</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleImportReset}>CLEAR</Button>
                        </Col>
                    </Row>
                </Grid>
            </Form>
            <ExcelFile element={<Button>Export to Excel</Button>} filename={"Import - " + moment().format('MM/DD/YYYY h:mm:ss')}>
                <ExcelSheet dataSet={this.importDataset()} name="Imports" />
            </ExcelFile>
            <ReactDataGrid
                enableCellSelect={true}
                resizable={true}
                columns={import_columns}
                rowGetter={this.rowImportGetter}
                rowsCount={this.state.data_import.length}
                minHeight={290}
                rowRenderer={RowRenderer}
            ></ReactDataGrid>
        </div>
        );
    }
}

class Exports extends Component {

    state = {
        //data_providers_size: 'default',
        data_types: [],
        // data_types_size: 'default',
        data_colors: [],
        // data_colors_size: 'default',
        data_export: [],
        size: 'default',

        se_data: {
            se_from_date: undefined,
            se_to_date: undefined,
            se_from_order: undefined,
            se_to_order: undefined,
            se_suppiler: undefined,
            se_type: undefined,
            se_color: undefined
        }

    }

    loadFabricTypes = () => {
        axios.get('api/fabric/type/get', { params: {} })
            .then((res) => {
                let data = res.data;
                let children = []
                let data_uni = []
                for (let i = 0; i < data.length; i++) {
                    if (data_uni.indexOf(data[i].fabrictype_name) === -1) {
                        children.push(<Option key={data[i].fabrictype_name}> {data[i].fabrictype_name} </Option>);
                        data_uni.push(data[i].fabrictype_name);
                    }
                }
                this.setState({ data_types: data_uni });
                this.loadFabricColors(data_uni);
            })
            .catch((err) => {
                console.log(err);
                this.setState({ data_types: [] });
            });
    }

    loadProviders = (v) => {
        axios.get('api/fabric/provider/get', { params: {} })
            .then((res) => {
                let data = res.data;
                let children = []
                let children_uni = []
                for (let i = 0; i < data.length; i++) {
                    if (data[i].provider_code && children_uni.indexOf(data[i].provider_code) === -1) {
                        children.push(<Option key={data[i].provider_code}>{data[i].provider_code}</Option>);
                        children_uni.push(data[i].provider_code);
                    }
                }
                this.setState({
                    data_providers: children_uni,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ data_providers: [] });
            });
    }

    loadFabricColors = () => {
        axios.get('api/fabric/color/get', { params: {} })
            .then((res) => {
                let colors = res.data;
                let colors_grid = [];
                let data_uni = [];
                for (let i = 0; i < colors.length; i++) {
                    if (data_uni.indexOf(colors[i].fabriccolor_name) === -1) {
                        colors_grid.push(<Option key={colors[i].fabriccolor_name}> {colors[i].fabriccolor_name}</Option>);
                        data_uni.push(colors[i].fabriccolor_name);
                    }
                }
                this.setState({ data_colors: data_uni });

            })
            .catch((err) => {
                this.setState({ data_colors: [] });
            });
    }
    componentDidMount = async () => {
        this.loadProviders();
        this.loadFabricTypes();
    }

    handleSearchExport = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
            let se_from_date = '';
            if (values.from_date) { se_from_date = values.from_date.format(dateFormat); }

            let se_to_date = '';
            if (values.to_date) { se_to_date = values.to_date.format(dateFormat); }

            let se_from_order = '';
            if (values.order_from) { se_from_order = values.order_from; }

            let se_to_order = '';
            if (values.order_to) { se_to_order = values.order_to; }

            let se_suppiler = '';
            if (values.provider_name) { se_suppiler = values.provider_name; }

            let se_type = '';
            if (values.fabrictype_name) { se_type = values.fabrictype_name; }

            let se_color = '';
            if (values.fabriccolor_name) { se_color = values.fabriccolor_name; }

            //////update params
            if (values.from_date) {
                values.from_date = values.from_date.format('YYYY-MM-DD');
            }

            if (values.to_date) {
                values.to_date = values.to_date.add(1, 'days').format('YYYY-MM-DD');
            }

            axios.get('api/fabric/warehouse/getexports', { params: values })
                .then((res) => {

                    this.setState({
                        se_data: {
                            se_from_date,
                            se_to_date,
                            se_from_order,
                            se_to_order,
                            se_suppiler,
                            se_type,
                            se_color
                        }
                    });

                    console.log(this.state.se_data);
                    let data = [];
                    for (let i = 0; i < res.data.length; i++) {
                        let row = res.data[i];
                        for (let j = 0; j < row.details.length; j++) {
                            let detail = row.details[j];
                            data.push({
                                inputdate_no: row.inputdate_no,
                                orderid: detail.orderid,
                                fabric_type: detail.fabric_type,
                                fabric_color: detail.fabric_color,
                                po_no: detail.po_no,
                                met: detail.met,
                                roll: detail.roll,
                                line_no: detail.line_no,
                                sku: detail.sku,
                                des: detail.des,
                                qty: detail.qty,
                                yield: detail.yield,
                                fab_qty: detail.fab_qty,
                                note: detail.note
                            });
                        }
                    }
                    this.setState({ data_export: data });
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ data_export: [] });
                });


        });
    }


    rowExportGetter = (i) => {
        if (i >= 0 && i < this.state.data_export.length) {
            return this.state.data_export[i];
        }
        return null;
    };

    exportDataset = () => {
        let dataset = [];
        dataset.push({
            xSteps: 2,
            ySteps: 0,
            columns: ['BÁO CÁO XUẤT VẢI'],
            data: [[]]
        });

        let conditions = {
            xSteps: 0,
            ySteps: 0,
            columns: ['', '', '', '', '']

        };

        let se_data = this.state.se_data;

        let conditions_data = [];
        conditions_data.push(['FROM DATE', se_data.se_from_date, '', 'TO DATE', se_data.se_to_date]);
        conditions_data.push(['FROM ORDER #', se_data.se_from_order, '', 'TO ORDER #', se_data.se_to_order]);
        conditions_data.push(['SUPPILER', se_data.se_suppiler, '', 'CODE', se_data.se_type]);
        conditions_data.push(['COLOR', se_data.se_color, '', '', '']);

        conditions.data = conditions_data;
        dataset.push(conditions);

        let data = {
            xSteps: 0,
            ySteps: 2,
            columns: ['DATE', 'ORDER #', 'CODE', 'COLOR', 'MET', 'ROLL', 'PO', 'LINE', 'SKU', 'DESCRIPTION', 'QTY', 'YIELD', 'FAB_QTY', 'NOTE'],
        }

        let data_row = [];

        for (let i = 0; i < this.state.data_export.length; i++) {
            let row = [];
            let r = this.state.data_export[i];
            let d = moment(r.inputdate_no);
            row.push(d.format('MM/DD/YYYY'));
            row.push(r.orderid);
            row.push(r.fabric_type);
            row.push(r.fabric_color);
            row.push(r.met);
            row.push(r.roll);
            row.push(r.po_no);
            row.push(r.line_o);
            row.push(r.sku);
            row.push(r.des);
            row.push(r.qty);
            row.push(r.yield);
            row.push(r.fab_qty);
            row.push(r.note);

            data_row.push(row);
        }
        data.data = data_row;
        dataset.push(data);
        console.log(dataset);
        return dataset;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { size } = 'default';

        return (<div>
            <Form className="ant-advanced-search-panel " onSubmit={this.handleSearchExport}>
                <Grid>
                    <Row className="show-grid">
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'FROM ORDER #'}>{
                                getFieldDecorator('order_from', {})(<InputNumber name='order_from' placeholder="from order no" />)
                            }
                            </FormItem>
                            <FormItem label={'TO ORDER #'}>{
                                getFieldDecorator('order_to', {})(<InputNumber name='order_to' placeholder="to oder no" />)
                            }
                            </FormItem>
                        </Col>
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'FROM DATE'}>{
                                getFieldDecorator('from_date', {})(<DatePicker size={size} format={dateFormat} />)
                            }
                            </FormItem>
                            <FormItem label={'TO DATE'}>{
                                getFieldDecorator('to_date', {})(<DatePicker size={size} format={dateFormat} />)
                            }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'SUPPILERS'}>{
                                getFieldDecorator('provider_name', {})(<AutoComplete placeholder='nhà cung cấp' dataSource={this.state.data_providers}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                />)
                            }

                            </FormItem>
                            <FormItem label={'COLOR '}>{
                                getFieldDecorator('fabric_color', {})(<AutoComplete placeholder='màu vải' dataSource={this.state.data_colors}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                ></AutoComplete>)
                            }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col md={6} sm={12} xs={6} style={{ textAlign: 'left' }}>
                            <FormItem label={'TYPE '}>{
                                getFieldDecorator('fabric_type', {})(<AutoComplete placeholder='loại vải' dataSource={this.state.data_types}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                ></AutoComplete>)
                            }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col md={4} sm={6} xs={12} style={{ textAlign: 'left' }}>
                            <Button type="primary" htmlType="submit">SEARCH</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>CLEAR</Button>
                        </Col>
                    </Row>
                </Grid>
            </Form>
            <ExcelFile element={<Button>Download Data</Button>} filename={"Export - " + moment().format('MM/DD/YYYY h:mm:ss')} >
                <ExcelSheet dataSet={this.exportDataset()} name="Export" />
            </ExcelFile>
            <ReactDataGrid
                enableCellSelect={true}
                resizable={true}
                columns={export_columns}
                rowGetter={this.rowExportGetter}
                rowsCount={this.state.data_export.length}
                minHeight={290}
                rowRenderer={RowRenderer}
            ></ReactDataGrid>
        </div>);
    }
}

class WarehouseReport extends Component {
    render() {
        const WapperInventory = Form.create()(Inventory);
        const WapperImports = Form.create()(Imports);
        const WapperExports = Form.create()(Exports);

        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="IMPORT" key="1">
                    <WapperImports />
                </TabPane >

                <TabPane tab="EXPORT" key="2">
                    <WapperExports />
                </TabPane >

                <TabPane tab="INVENTORY" key="3">
                    <WapperInventory />
                </TabPane >
            </Tabs >

        );
    }
}

export default WarehouseReport;