const mongoose = require('mongoose');
const fabricexport_detail = new mongoose.Schema({
    exportid:String,
    fabric_color: String,
    orderid: Number,
    met: Number,
    fabric_type: String,
    roll: { type: Number, default: 0 },
    po_no: { type: Number, default: 0 },
    line_no: { type: Number, default: 0 },

    sku: { type: String, default: null },
    des: { type: String, default: null },
    qty: { type: Number, default: 0 },
    yield: { type: Number, default: 0 },
    fab_qty: { type: Number, default: 0 },

    note: { type: String, default: null },
    create_date: { type: Date, default: new Date() },
    update_date: { type: Date, default: null },
    record_status: { type: String, default: 'O' }
});

fabricexport_detail.virtual('id').get(function () {
    return this._id;
});

module.exports = mongoose.model('fabricexportsdetails', fabricexport_detail);
