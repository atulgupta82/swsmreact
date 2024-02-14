import React, { useEffect, useState } from 'react'
import './AddBudgetForm.css'
import { Alert, Form } from 'react-bootstrap';
import { get_financial_year, get_scheme_type, get_schemes, add_budget } from '../../../helper/Api';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { DeleteForever } from '@mui/icons-material';
import { AddCommasToAmount } from '../../../helper/Utils';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import AddBudgetPreview from '../../../components/Modal/AddBudgetPreview';


const AddBudgetForm = () => {

    const { authData } = useSelector((state) => state.authData);
    const [fy_list, set_fy_list] = useState([]);
    const [st_list, set_st_list] = useState([]);
    const [schemes, set_schemes] = useState([]);
    const [showPreview,setShowPreview]=useState(false);
    const [min_max_date, setMinMaxDate] = useState({
        min: null,
        max: null,
    });
    const [subheadsList, set_subheadsList] = useState([]);
    const [error, setError] = useState({
        status: false,
        msg: ''
    });
    const [loading,setLoading]=useState(false);

    const [formData, setFormData] = useState({
        scheme_id: null,
        sub_heads: [
            { name: '', id: '', financial_year: '', budget: '', provisional_budget: '' },
        ],
        added_by: authData.user.id,
        newSub_heads:[],
        attachment: [],
    });

    const navigate = useNavigate();

    const fetch_list = async () => {
        const fy = await get_financial_year();
        const st = await get_scheme_type();
        const schemes_list = await get_schemes();
        if (schemes_list.data.status) {
            set_schemes(schemes_list.data.schemes);
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
    }, [])

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
                return filter[0];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    const resetFormData = () => {
        setFormData({
            scheme_id: null,
            sub_heads: [
                { name: '', id: '', financial_year: '', budget: '' },
            ],
            added_by: authData.user.id,
            attachment: [],
        });
    }

    const handleSchemFormData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value })
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
        // console.log( new Date().toISOString())
    }


    const handleSubHeadChange = (index, field, value) => {
        const newSubHeads = [...formData.sub_heads];
        newSubHeads[index][field] = value;
        setFormData({
            ...formData,
            sub_heads: newSubHeads
        });
    }

    const handleAddSubHead = () => {
        const newSubHeads = [...formData.sub_heads];
        newSubHeads.push({ name: '', id: '', financial_year: '', budget: '' });
        setFormData({
            ...formData,
            sub_heads: newSubHeads
        });
    };

    const handleNewSubHeadChange = (index, field, value) => {
        const newSubHeads = [...formData.newSub_heads];
        newSubHeads[index][field] = value;
        setFormData({
          ...formData,
          newSub_heads: newSubHeads
        });
    };

    const deleteNewSubhead = (index) => {
        const updatedSubHeads = [...formData.newSub_heads];
        updatedSubHeads.splice(index, 1);
        setFormData({
          ...formData,
          newSub_heads: updatedSubHeads,
        });
    };

    const handleAddNewSubHead = () => {
        const newSubHeads = [...formData.newSub_heads];
        newSubHeads.push({ name: '', code: '', financial_year: '', budget: '' });
        setFormData({
            ...formData,
            newSub_heads: newSubHeads
        });
    };
    const handleAttachmentChange = (event) => {
        const files = event.target.files;
        setFormData({
            ...formData,
            attachment: files
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        const post_data = new FormData();
        for (let i = 0; i < formData.attachment.length; i++) {
            post_data.append('attachment[]', formData.attachment[i]);
        }
        post_data.append('scheme_id', formData.scheme_id);
        post_data.append('financial_year', formData.financial_year);
        post_data.append('sub_heads', JSON.stringify(formData.sub_heads));
        post_data.append('newSub_heads',JSON.stringify(formData.newSub_heads));
        post_data.append('added_by', authData.user.id);
        try {
            // console.log(post_data);return false;
            setLoading(true);
            const budgetResponse = await add_budget(post_data);
            const budgetResponseData = budgetResponse.data;
            if (budgetResponseData.status) {
                setLoading(false);
                setShowPreview(false);
                resetFormData();
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
            setError({
                status: false,
                msg: "something went wrong..."
            })
            // console.log(error)
        }
    }
    const deleteSubhead = (index) => {
        const updatedSubHeads = [...formData.sub_heads];
        updatedSubHeads.splice(index, 1);
        setFormData({
            ...formData,
            sub_heads: updatedSubHeads,
        });
    };

    const total_scheme_budget = () => {
        const subheads = formData.sub_heads;
        let total_budget = 0;
        subheads.map((sub) => {

            if (sub.budget) {
                total_budget = total_budget + parseFloat(sub.budget)
            }
            return {

            }
        })
        return AddCommasToAmount(total_budget.toFixed(2));
    }
    
    const previewhandler = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    return (
        <div>
            <AddBudgetPreview showPreview={showPreview} setShowPreview={setShowPreview} formData={formData} handleSubmit={handleSubmit} schemes={schemes} subheadsList={subheadsList} total_scheme_budget={total_scheme_budget}></AddBudgetPreview>
            <div className="p-3">
                <div className="row">
                    {error.status && (
                        <Alert variant="success" onClose={() => setError({ status: false, msg: '' })} dismissible>
                            {error.msg}
                        </Alert>
                    )}
                    <Form onSubmit={previewhandler}>
                        <div className="col-md-12">
                            <div className="add_new_user">
                                <h4> Add Budget</h4>
                                <div>
                                    <a href="#" type="button" className="btn btn-light">Cancel</a>
                                    <button type="submit" disabled={loading} className="btn btn-primary">{loading ? "LOADING...":"SAVE"}</button>
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
                                                                        schemes.l2_status == 1 && schemes.l3_status == 1 && <option value={schemes.id}
                                                                            key={schemes.id}>{schemes.code}</option>
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
                                                        <select className="form-control " id="financial_year" name='financial_year'
                                                            onChange={handleSchemFormData}
                                                            required
                                                        >
                                                            <option value="">---select year---</option>
                                                            {
                                                                fy_list.map((fy) => {
                                                                    return (
                                                                        <option value={fy.id} key={fy.id}>{fy.year}</option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                formData.sub_heads.map((subHead, i) => {
                                                    return (
                                                        <>
                                                            <div className='container-fluid'>
                                                                <div className='row eachsubheadBlock'>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputSub" className="col-sm-4 col-form-label">Sub Head Code-{i + 1}
                                                                                <span className="text-danger">*</span> :
                                                                            </label>
                                                                            <div className="col-sm-8">
                                                                                <select className="form-control "
                                                                                    id="code" name='id'
                                                                                    required
                                                                                    onChange={(e) => handleSubHeadChange(i, 'id', e.target.value)}>
                                                                                    <option value="">---Select Sub Head Code-{i + 1}---</option>
                                                                                    {
                                                                                        subheadsList.map((subhead) => {
                                                                                            return (
                                                                                                <option value={subhead.id} key={subhead.id}>{subhead.code}</option>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputHead" className="col-sm-4 col-form-label">Sub Head Name-{i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8 col-form-label">
                                                                                <label >{get_subheadName(formData.sub_heads[i].id).name}</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputFinancials"
                                                                                className="col-sm-4 col-form-label">
                                                                                Budget Date {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8 ">
                                                                                <Form.Control
                                                                                    type="date"
                                                                                    max={min_max_date.max}
                                                                                    min={min_max_date.min}
                                                                                    name="budget_date"
                                                                                    value={subHead.budget_date}
                                                                                    onChange={(e) => handleSubHeadChange(i, 'budget_date', e.target.value)}
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputBudget" className="col-sm-4 col-form-label">Budget-{i + 1}
                                                                                :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="text" className="form-control" id="budget"

                                                                                    value={formData.sub_heads[i].budget}
                                                                                    onChange={(e) => handleSubHeadChange(i, 'budget', e.target.value)}
                                                                                    placeholder="₹ Enter Budget Amount" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputBudget" className="col-sm-4 col-form-label">Provisional  Budget {i + 1}
                                                                                :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="number" className="form-control" id="provisional_budget"

                                                                                    value={formData.sub_heads[i].provisional_budget}
                                                                                    onChange={(e) => handleSubHeadChange(i, 'provisional_budget', e.target.value)}
                                                                                    placeholder="₹ Enter Provisional Budget Amount" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    i > 0 && <Button variant='danger' size='sm' className='mb-2' onClick={() => deleteSubhead(i)}>Sub Head {i + 1}<DeleteForever /></Button>

                                                                }
                                                            </div>
                                                        </>
                                                    );
                                                })
                                            }

                                            {
                                                formData.sub_heads.length < subheadsList.length ? (
                                                    <div className="col-sm-12 mt-3 mb-3 ">
                                                        <button type="button" className="btn btn-outline-primary" onClick={handleAddSubHead}><i className="fa fa-plus"></i>
                                                            Add Sub Head</button>
                                                    </div>
                                                ) : ""
                                            }
                                            <hr />
                                            {formData.newSub_heads.length>0 ?<h5 className=''><b>Create New Subhead Section:</b></h5>:""}                                            
                                            {
                                                formData.newSub_heads.map((subHead, i) => {
                                                    return (
                                                        <>
                                                            <div className='container-fluid'>
                                                                <div className='row eachsubheadBlock'>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputSub" className="col-sm-4 col-form-label">Sub Head Name {i + 1}
                                                                                <span className="text-danger">*</span> :
                                                                            </label>
                                                                            <div className="col-sm-8">
                                                                                <input type="text" className="form-control" id="name"
                                                                                    value={subHead.name}
                                                                                    required
                                                                                    onChange={(e) => handleNewSubHeadChange(i, 'name', e.target.value)}
                                                                                    placeholder="Enter Sub Head Name" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputFinancials"
                                                                                className="col-sm-4 col-form-label">
                                                                                Budget Date {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8 ">
                                                                                <Form.Control
                                                                                    type="date"
                                                                                    name="budget_date"
                                                                                    value={subHead.budget_date}
                                                                                    onChange={(e) => handleNewSubHeadChange(i, 'budget_date', e.target.value)}
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputHead" className="col-sm-4 col-form-label">Sub Head Code {i + 1}
                                                                                <span className="text-danger">*</span> :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="text"
                                                                                    required
                                                                                    className="form-control" id="code"
                                                                                    value={subHead.code}
                                                                                    onChange={(e) => handleNewSubHeadChange(i, 'code', e.target.value)}
                                                                                    placeholder="Enter Sub Head Code" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputBudget" className="col-sm-4 col-form-label">Budget {i + 1}
                                                                                :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="number" className="form-control" id="budget"

                                                                                    value={subHead.budget}
                                                                                    onChange={(e) => handleNewSubHeadChange(i, 'budget', e.target.value)}
                                                                                    placeholder="₹ Enter Budget Amount" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6 p-2">
                                                                        <div className="form-group row">
                                                                            <label for="inputBudget" className="col-sm-4 col-form-label">Provisional  Budget {i + 1}
                                                                                :</label>
                                                                            <div className="col-sm-8">
                                                                                <input type="number" className="form-control" id="provisional_budget"

                                                                                    value={subHead.provisional_budget}
                                                                                    onChange={(e) => handleNewSubHeadChange(i, 'provisional_budget', e.target.value)}
                                                                                    placeholder="₹ Enter Provisional Budget Amount" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    i >= 0 && <button type="button" className="btn btn-outline-danger mb-2" onClick={() => deleteNewSubhead(i)}>Remove New Sub Head {i + 1}<DeleteForever /></button>

                                                                }
                                                            </div>
                                                        </>
                                                    );
                                                })
                                            }
                                            <div className="col-sm-12 mt-3 mb-3 ">
                                                <button type="button" className="btn btn-outline-primary" onClick={handleAddNewSubHead}><i className="fa fa-plus"></i>
                                                    Create New Sub Head</button>
                                            </div>
                                            <div className="col-sm-12 p-2">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="input-group">
                                                            <label className="input-group-btn my-0">

                                                                <input type="file"
                                                                    className='form-control'
                                                                    onChange={handleAttachmentChange}
                                                                    name='attachment'
                                                                    accept=".pdf,.jpeg,.jpg,.png" multiple />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-12 p-2">
                                                <div className="border mt-3">
                                                    <div className="p-1 pt-2 pb-2">
                                                        <p><b>Total Scheme Budget </b>: {total_scheme_budget()}</p>
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
    )
}

export default AddBudgetForm