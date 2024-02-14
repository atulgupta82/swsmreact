import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {AddCommasToAmount} from "../../../helper/Utils";
import DataTable from "react-data-table-component";
import Tools from "../../../components/Tools/Tools";
import {Form} from "react-bootstrap";
import {ADD_CHALLAN_FAIL, ADD_CHALLAN_START} from "../../../RTK/Slices/ChallanSlice";
import {
    addTDSChallan,
    get_tds_codes,
} from "../../../helper/Api";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";


const AddTDSITChallan = () => {

    let {state} = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data] = useState(state && state?.data ? state.data : []);
    const [showPreview, setShowPreview] = useState(false);
    const [schemes, setSchemes] = useState([]);

    const [formData, setFormData] = useState({
        id: '',
        tds_code_id: '',
        invoices: [],
        challan_no: '',
        bsr_code: '',
        tds_challan_value: '',
        challan_date: '',
        challan_url: '',
        attachments: [],
    });

    const customStyles = {
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px"
            },
        },
    };

    const columns = [
        {
            name: 'Invoice No',
            selector: (row) => <b>{row.invoice_no}</b>,
            wrap: true,
            sortable: true,
            width: "200px",
        },
        {
            name: 'Invoice Date',
            selector: (row) => <b>{row.invoice_date}</b>,
            wrap: true,
            sortable: true,
            width: "200px",

        },
        {
            name: 'Beneficiary\n' +
                'Name',
            selector: (row) => <b>{row.company_name || ''}</b>,
            sortable: true,
            wrap: true,
            width: "200px"
        },
        {
            name: 'Beneficiary\n' +
                'PAN No.',
            selector: (row) => <b>{row.pan_no}</b>,
            sortable: true,
            width: "200px",
            wrap: true

        },
        {
            name: 'Payment\n' +
                'Type',
            selector: (row) =>
                <b>{row.payment_type === '1' ? "FULL PAYMENT" : row.payment_type === '2' ? 'PART PAYMENT' : ''}</b>,
            sortable: true,
            width: "250px",
            wrap: true,
        },
        {
            name: 'Voucher No',
            selector: (row) => <b>{row.voucher_no}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Voucher\n' +
                'Date',
            selector: (row) => <b>{row.voucher_date}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'Transaction\n' +
                'Date',
            selector: (row) => <b>{row.amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Taxable\n' +
                'Amount',
            selector: (row) => <b>{row.taxable_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'INVOICE\n' +
                'AMOUNT',
            selector: (row) => <b>{row.payable_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'INVOICE\n' +
                'Amount\n' +
                'Sanctioned',
            selector: (row) => <b>{row.sanction_amount || ''}</b>,
            sortable: true,
            width: "150px",
            right: false
        }, {
            name: 'TDS IT',
            selector: (row) => <b>{row?.tds_it_amount}</b>,
            sortable: true,
            width: "150px",
            right: false
        },
        {
            name: 'Details',
            width: "200px",
            selector: (row) => row?.invoice ?
                <a href={row?.invoice} target="_blank" rel="noreferrer">Attachment</a> : '',
            sortable: false,
        },
    ];


    const calculateTotalAmount = (propertyName) => {
        let total = 0;
        data.forEach((row) => {
            const depositAmount = Number(parseFloat(row[propertyName]));
            if (!isNaN(depositAmount)) {
                total += depositAmount;
            }
        });
        return total.toFixed(2);
    };

    const totalInvoiceAmount = calculateTotalAmount('tds_it_amount');

    const footerRow = {
        isFooter: true,
        selectableRowsSingle: false,
        invoice_no: <b>Total</b>,
        tds_it_amount: <b>{AddCommasToAmount(totalInvoiceAmount)}</b>,
    };

    //const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const updatedData = [...data, footerRow];

    const fetchLists = async () => {

        try {

            const schemes = await get_tds_codes();
            if (schemes.data.status) {
                setSchemes(schemes.data.list)

            }
        } catch (e) {

        }


    }

    useEffect(() => {
        fetchLists();
    }, [])

    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        setFormData({
            ...formData,
            attachment: files
        });
    };
    const handleChallanFormData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({...formData, [name]: value})
    }

    const handleSubmit = async (e) => {
        try {
            // console.log('dataaaa', data);
            const invoices = [];

            data.forEach(el => {
                invoices.push(el.id);
            });
            const post_data = new FormData();
            for (let i = 0; i < formData.attachment.length; i++) {
                post_data.append('attachment[]', formData.attachment[i]);
            }
            post_data.append('invoices', invoices.join(','));
            post_data.append('tds_code_id', formData.tds_code_id);
            post_data.append('challan_no', formData.challan_no);
            post_data.append('challan_date', formData.challan_date);
            post_data.append('bsr_code', formData.bsr_code);
            post_data.append('challan_no', formData.challan_no);
            post_data.append('tds_challan_value', totalInvoiceAmount);
            // post_data.append('challan_url', formData.challan_url);
            debugger
            dispatch(ADD_CHALLAN_START());
            const response = await addTDSChallan(post_data);
            let addChallanResponseData = response.data;
            if (addChallanResponseData.status) {
                setShowPreview(false);
                // dispatch(ADD_CHALLAN_SUCCESS(addChallanResponseData.list[0]));
                navigate('/tds-it');
            } else {
                toast.error(addChallanResponseData.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                dispatch(ADD_CHALLAN_FAIL(addChallanResponseData.message));
            }
        } catch (error) {
            dispatch(ADD_CHALLAN_FAIL('error getting while updating challan'));

        }
    }

    return (
        <div>
            <Tools/>
            <div className='addNewScheme'>
                <div className="add_new_user">
                    <h4>Add Challan</h4>
                    <div>

                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Add Challan
                        </button>
                    </div>
                </div>
            </div>
            <DataTable
                customStyles={customStyles}
                className="dataTables_wrapper"
                columns={columns}
                data={updatedData}
                fixedHeader
                fixedHeaderScrollHeight="600px"
            />


            <div>
                <div className="p-3">
                    <div className="row">
                        <Form>
                            <div className="col-md-12">

                                <div className="card p-3 mt-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="scheme_id"
                                                               className="col-sm-4 col-form-label">Select
                                                            Code
                                                            <span className="text-danger">*</span> :</label>
                                                        <div className="col-sm-8">
                                                            <select className="form-control "
                                                                    id="tds_code_id" name='tds_code_id'
                                                                    required
                                                                    value={formData.tds_code_id}
                                                                    onChange={handleChallanFormData}>
                                                                <option>Select Code</option>
                                                                {
                                                                    schemes.map((st) => {
                                                                        return (
                                                                            <option value={st.id}
                                                                                    key={st.id}>{st.code}</option>
                                                                        );
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="inputType" className="col-sm-4 col-form-label">Total
                                                            TDS Challan Value
                                                            <span className="text-danger">*</span> :</label>
                                                        <div className="col-sm-8">
                                                            <input type="text" className="form-control" id="snaName"
                                                                   name='snaName'
                                                                   required
                                                                   disabled
                                                                   value={totalInvoiceAmount}
                                                                   placeholder="Enter SNA Name"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="inputScheme"
                                                               className="col-sm-4 col-form-label">Challan No
                                                            <span className="text-danger">*</span> :</label>
                                                        <div className="col-sm-8">
                                                            <input type="text" className="form-control" id="challan_no"
                                                                   name='challan_no'
                                                                   required
                                                                   value={formData.challan_no}
                                                                   onChange={handleChallanFormData}
                                                                   placeholder="Enter Challan No"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="inputFinancials"
                                                               className="col-sm-4 col-form-label">
                                                            Challan Date
                                                            <span className="text-danger">*</span> :
                                                        </label>
                                                        <div className="col-sm-8 ">
                                                            <Form.Control
                                                                type="date"
                                                                name="challan_date"
                                                                value={formData.challan_date}
                                                                onChange={handleChallanFormData}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="col-sm-6 p-2">
                                                    <div className="form-group row">
                                                        <label htmlFor="inputSchemee"
                                                               className="col-sm-4 col-form-label">BSR CODE<span
                                                            className="text-danger">*</span> :
                                                        </label>
                                                        <div className="col-sm-8">
                                                            <input type="text" className="form-control" id="bsr_code"
                                                                   name='bsr_code'
                                                                   required
                                                                   placeholder="Enter BSR Code"
                                                                   onChange={handleChallanFormData}
                                                                   value={formData.bsr_code}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-sm-12 p-2">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="input-group">
                                                                <label className="input-group-btn my-0 mt-2 mr-2">
                                                                    Upload Challan<span className='text-danger'>*</span>:
                                                                </label>
                                                            </div>
                                                            {
                                                                !formData?.attachments?.length ? (
                                                                    <label className='p-1'>
                                                                        <input id="" type="file"
                                                                               className='form-control'
                                                                               onChange={handleAttachmentChange}
                                                                               name='attachment'
                                                                               accept=".pdf,.jpeg,.jpg,.png"
                                                                               multiple/>
                                                                    </label>
                                                                ) : (
                                                                    formData.attachments.map((att, i) => {
                                                                        return (
                                                                            <a className="mt-2 mx-2" href={att.file_url}
                                                                               target='_blank'>Attachment {i + 1}</a>);
                                                                    })
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddTDSITChallan
