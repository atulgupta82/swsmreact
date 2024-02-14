import React, {useEffect, useState} from 'react'
import './AddBudgetForm.css'
import {Alert, Form, InputGroup} from 'react-bootstrap';
import {
    get_financial_year,
    get_scheme_type,
    get_schemes,
    add_budget,
    get_budget_list,
    update_budget_by_id
} from '../../../helper/Api';
import {useSelector} from 'react-redux';
import {FaUpload} from 'react-icons/fa';
import {Button} from 'react-bootstrap';
import {DeleteForever} from '@mui/icons-material';
import {AddCommasToAmount} from '../../../helper/Utils';
import {toast} from 'react-toastify';
import {Link, Navigate, useNavigate, useParams} from 'react-router-dom';

const EditBudgetForm = () => {
    const {id} = useParams();
    const {authData} = useSelector((state) => state.authData);
    const [fy_list, set_fy_list] = useState([]);
    const [st_list, set_st_list] = useState([]);
    const [schemes, set_schemes] = useState([]);
    const [min_max_date, setMinMaxDate] = useState({
        min: null,
        max: null,
    });
    const [subheadsList, set_subheadsList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        "id": "",
        "subhead_id": "",
        "l2remarks": "",
        "l3remarks": "",
        "scheme_id": 54,
        "financial_year": "",
        "budget": "",
        "provisional_budget": "",
        "budget_date": "",
        "subhead_code": "",
        "subhead_name": "",
        "scheme_code": "",
        "scheme_name": "",
        "attachments": []
    });

    const navigate = useNavigate();

    const fetch_list = async () => {
        const fy = await get_financial_year();
        const st = await get_scheme_type();
        const schemes_list = await get_schemes();
        if (schemes_list.data.status) {
            set_schemes(schemes_list.data.schemes);
            if (formData.scheme_id > 0) {
                const filter = schemes_list.data.schemes.filter((scheme) => scheme.id == formData.scheme_id);
                if (filter.length > 0) {
                    set_subheadsList(filter[0].sub_head_list);
                } else {
                    set_subheadsList([]);
                }
            }
        } else {
            set_schemes([]);
        }
        // console.log(schemes_list);
        if (fy.data.status) {
            set_fy_list(fy.data.list)
        }
        if (st.data.status) {
            set_st_list(st.data.list)
        }
    }

    useEffect(() => {
        fetch_list();
        get_budget_details();
    }, [])
    const get_budget_details = async () => {
        const {data} = await get_budget_list(null, id);
        if (data.status) {
            // const modifiedBudgets = data.budgets.map((budget) => {
            //     const { attachments, ...rest } = budget;
            //     return rest;
            // });
            // console.log(modifiedBudgets);return false;  
            setFormData(data.budgets[0]);
        } else {
            setFormData([]);
        }
    }


    const get_schemeName = (id) => {
        if (id) {
            const filter = schemes.filter((scheme) => scheme.id == id);
            if (filter.length > 0) {
                return filter[0].name;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    const get_subheadName = (id) => {
        if (id) {
            const filter = subheadsList.filter((subhead) => subhead.id == id);
            if (filter.length > 0) {
                // console.log(filter)
                return filter[0].name;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    const handleSchemFormData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({...formData, [name]: value})
        if (name == 'scheme_id') {
            if (value) {
                const filter = schemes.filter((scheme) => scheme.id == value);
                if (filter.length > 0) {
                    set_subheadsList(filter[0].sub_head_list);
                } else {
                    set_subheadsList([]);
                }
            } else {
                set_subheadsList([]);
            }
        } else if (name == 'financial_year') {
            const filter = fy_list.filter((fy) => fy.id == value);
            if (filter.length > 0) {
                setMinMaxDate({
                    min: `${filter[0].start_year}-04-01`,
                    max: `${filter[0].end_year}-03-31`
                })
            } else {
                setMinMaxDate({
                    min: null,
                    max: null
                })
            }
        }
    }

    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        setFormData({
            ...formData,
            attachments: files
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        // return false;
        const post_data = new FormData();
        for (let i = 0; i < formData.attachments.length; i++) {
            if (formData.attachments[i]['name']) {
                post_data.append('attachment[]', formData.attachments[i]);
            }
        }

        post_data.append('id', formData.id);
        post_data.append('subhead_id', formData.subhead_id);
        post_data.append('scheme_id', formData.scheme_id);
        post_data.append('financial_year', formData.financial_year);
        post_data.append('budget', formData.budget);
        post_data.append('provisional_budget', formData.provisional_budget);
        post_data.append('budget_date', formData.budget_date);
        post_data.append('added_by', authData.user.id);
        try {
            setLoading(true);
            // console.log(post_data);return false;
            const budgetResponse = await update_budget_by_id(post_data);
            const budgetResponseData = budgetResponse.data;
            // console.log(budgetResponseData);return false;
            if (budgetResponseData.status) {
                setLoading(false);
                toast.success(budgetResponseData.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                navigate('/budgets');
            } else {
                setLoading(false);
                toast.error(budgetResponseData.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        } catch (error) {
            setLoading(false);
            toast.error("Something went wrong.Code Error.", {
                position: toast.POSITION.TOP_CENTER
            });
            console.log(error)
        }
    }

    const total_scheme_budget = () => {
        const subheads = formData.sub_heads;
        let total_budget = 0;
        subheads.map((sub) => {

            if (sub.budget) {
                total_budget = total_budget + parseFloat(sub.budget)
            }
            return {}
        })
        return AddCommasToAmount(total_budget.toFixed(2));
    }

    return (
        <div>
            <div className="p-3">
                <div className="row">
                    <Form onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="add_new_user">
                                <h4> Update Budget</h4>
                                <div>
                                    <Link to="/budgets">
                                        <button type="button" className="btn btn-light">CANCEL</button>
                                    </Link>
                                    <button type="submit" disabled={loading}
                                            className="btn btn-primary"> {loading ? "LOADING" : "UPDATE"}</button>
                                </div>
                            </div>
                            <div className="card p-3 mt-3">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputDepartment"
                                                           className="col-sm-4 col-form-label">Scheme Code
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <select className="form-control "
                                                                id="scheme_id" name='scheme_id'
                                                                required
                                                                onChange={handleSchemFormData}>
                                                            <option value="">Select Scheme Code</option>
                                                            {
                                                                schemes.map((schemes) => {
                                                                    return (
                                                                        schemes.l2_status == 1 && schemes.l3_status == 1 &&
                                                                        <option value={schemes.id}
                                                                                key={schemes.id}
                                                                                selected={formData.scheme_id == schemes.id}>{schemes.code}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label for="inputType" className="col-sm-4 col-form-label">
                                                        Scheme Name
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <label htmlFor="">{get_schemeName(formData.scheme_id)}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-sm-6 p-2'>
                                                <div className="form-group row">
                                                    <label for="inputFinancial"
                                                           className="col-sm-4 col-form-label">
                                                        Financial Year
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <select className="form-control " id="financial_year"
                                                                name='financial_year'
                                                                onChange={handleSchemFormData}
                                                                required
                                                        >
                                                            <option value="">---select year---</option>
                                                            {
                                                                fy_list.map((fy) => {
                                                                    return (
                                                                        <option value={fy.id} key={fy.id}
                                                                                selected={formData.financial_year == fy.id}>{fy.year}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='container-fluid'>
                                                <div className='row eachsubheadBlock'>
                                                    <div className="col-sm-6 p-2">
                                                        <div className="form-group row">
                                                            <label htmlFor="subhead_id"
                                                                   className="col-sm-4 col-form-label">Sub Head Code
                                                                <span className="text-danger">*</span> :
                                                            </label>
                                                            <div className="col-sm-8">
                                                                <select className="form-control "
                                                                        id="subhead_id" name='subhead_id'
                                                                        required
                                                                        onChange={handleSchemFormData}
                                                                >
                                                                    <option value="">---Select Sub Head Code---</option>
                                                                    {
                                                                        subheadsList.map((subhead) => {
                                                                            return (
                                                                                <option value={subhead.id}
                                                                                        key={subhead.id}
                                                                                        selected={formData.subhead_id == subhead.id}>{subhead.code}</option>
                                                                            );
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 p-2">
                                                        <div className="form-group row">
                                                            <label for="inputHead" className="col-sm-4 col-form-label">Sub
                                                                Head Name
                                                                <span className="text-danger">*</span> :</label>
                                                            <div className="col-sm-8 col-form-label">
                                                                <label>{get_subheadName(formData.subhead_id)}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 p-2">
                                                        <div className="form-group row">
                                                            <label htmlFor="budget_date"
                                                                   className="col-sm-4 col-form-label">
                                                                Budget Date
                                                                <span className="text-danger">*</span> :</label>
                                                            <div className="col-sm-8 ">
                                                                <Form.Control
                                                                    type="date"
                                                                    onChange={handleSchemFormData}
                                                                    max={min_max_date.max}
                                                                    min={min_max_date.min}
                                                                    name="budget_date"
                                                                    id='budget_date'
                                                                    value={formData.budget_date}

                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 p-2">
                                                        <div className="form-group row">
                                                            <label htmlFor="budget" className="col-sm-4 col-form-label">Budget
                                                                :</label>
                                                            <div className="col-sm-8">
                                                                <input type="text"
                                                                       value={formData.budget}
                                                                       name='budget'
                                                                       id="budget"
                                                                       onChange={handleSchemFormData}
                                                                       className="form-control"
                                                                       placeholder="₹ Enter Budget Amount"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6 p-2">
                                                        <div className="form-group row">
                                                            <label htmlFor="provisional_budget"
                                                                   className="col-sm-4 col-form-label">Provisional
                                                                Budget
                                                                :</label>
                                                            <div className="col-sm-8">
                                                                <input type="number"
                                                                       value={formData.provisional_budget}
                                                                       className="form-control" id="provisional_budget"
                                                                       name='provisional_budget'
                                                                       onChange={handleSchemFormData}
                                                                       placeholder="₹ Enter Provisional Budget Amount"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputBranch" className="col-sm-4 col-form-label">L2
                                                        Remark
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <InputGroup>
                                                            <Form.Control as="textarea" aria-label="With textarea"
                                                                          name='l2remarks'
                                                                          id="l2remarks"
                                                                          disabled={authData.user.user_type !== 'l2'}
                                                                          value={formData.l2remarks}>
                                                            </Form.Control>
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 p-2">
                                                <div className="form-group row">
                                                    <label htmlFor="inputBranch" className="col-sm-4 col-form-label">L3
                                                        Remark
                                                        <span className="text-danger">*</span> :</label>
                                                    <div className="col-sm-8">
                                                        <InputGroup>
                                                            <Form.Control as="textarea" aria-label="With textarea"
                                                                          name='l3remarks'
                                                                          id="l3remarks"
                                                                          disabled={authData.user.user_type !== 'l3'}
                                                                          value={formData.l3remarks}>
                                                            </Form.Control>
                                                        </InputGroup>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-12 p-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="input-group">
                                                            <label className="input-group-btn my-0">
                                                                <input type="file"
                                                                       className='form-control'
                                                                       onChange={handleAttachmentChange}
                                                                       name='attachments'
                                                                       accept=".pdf,.jpeg,.jpg,.png" multiple/>
                                                            </label>
                                                        </div>
                                                        <div className='mt-2'>
                                                            {
                                                                formData.attachments.map((att, i) => {
                                                                    return (<a href={att.file_url}
                                                                               target='_blank'>Attachment {i + 1}</a>);
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="col-sm-12 p-2">
                                            <div className="border mt-3">
                                                <div className="p-1 pt-2 pb-2">
                                                    <p><b>Total Scheme Budget </b>: 
                                                    {total_scheme_budget()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default EditBudgetForm
