import React from 'react'
import { Table } from 'react-bootstrap'

const EditInvoiceSchemeVeiw = ({schemes}) => {
    // console.log(schemes)
    return (
        <div>
            <h6>Scheme Details:</h6>
            <Table striped bordered hover className='mt-2'>
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Scheme Code</th>
                        <th>Scheme Name</th>
                        <th>Financial Year</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        schemes.map((scheme,i)=>{
                            return(
                                <tr>
                                    <td>{i+1}</td>
                                    <td>{scheme.code}</td>
                                    <td>{scheme.name}</td>
                                    <td>{scheme.financial_year}</td>
                                    <td>{scheme.invoice_scheme_amount}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
        </div>
    )
}

export default EditInvoiceSchemeVeiw