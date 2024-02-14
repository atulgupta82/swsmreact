import React from 'react'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import './Sidebar.css';
import logo from '../../assets/images/logo.png';
import SidebarProfile from '../../components/SidebarProfile/SidebarProfile';
import {Link, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {useSelector} from 'react-redux'


const Sidebar = () => {

    const [open, setOpen] = React.useState(true);
    const [FundReleaseOpen, SetFundReleaseOpen] = React.useState(false);
    const [reportsOpen, SetreportsOpen] = React.useState(false);
    const [reconciliatinOpen, SetReconciliatinOpen] = React.useState(false);
    const [user_type, set_User_type] = React.useState('');
    const {authData} = useSelector((state) => state.authData);
    const handleClick = () => {
        setOpen(!open);
    };

    const handleClickFundRealse = () => {
        SetFundReleaseOpen(!FundReleaseOpen)
    }
    const handleClickReports = () => {
        SetreportsOpen(!reportsOpen)
    }

    const handleClickreconciliation = () => {
        SetReconciliatinOpen(!reconciliatinOpen)
    }


    useEffect(() => {
        set_User_type(authData.user.user_type);
    }, [])
    const location = useLocation();

    const isActive = (url) => {
        return location.pathname === url;
    };


    return (
        <div>
            <List
                sx={{width: '100%', maxWidth: 360,}}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader" className="logoWrapper">
                        {/* <img src={logo} alt="logo" className="logo" /> */}
                    </ListSubheader>
                }
                className='sidebar'>
                <Link to='/' className={isActive('/') ? 'active' : ""}>
                    <ListItemButton className='sidbar_linkWrapper'>
                        <ListItemText primary="Dashboard" className='sidebarLinkText'/>
                    </ListItemButton>
                </Link>
                <Link to='/users' className={isActive('/users') ? 'active' : ""}>
                    <ListItemButton className='sidbar_linkWrapper'>
                        <ListItemText primary="User Management" className='sidebarLinkText'/>
                    </ListItemButton>
                </Link>


                <ListItemButton onClick={handleClick}
                                className={open ? 'subMenuWrapper subMenuWrapper_top_border' : ''}>
                    <ListItemText primary="Budget Allocation" className='sidebarLinkText'/>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit
                          className={open ? 'subMenuWrapper subMenuWrapper_bottom_border' : ''}>
                    <List component="div" disablePadding>
                        <Link to='/schemes' className={isActive('/schemes') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Schemes" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                        {user_type && user_type === "l1" ? <>

                            <Link to='/add-budget' className={isActive('/add-budget') ? 'active' : ""}>
                                <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                    <ListItemText primary="Add Budget" className='sidebarLinkText'/>
                                </ListItemButton>
                            </Link>
                        </> : ""}
                        <Link to='/budgets' className={isActive('/budgets') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Budgets" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>
                <Link to='/beneficiary' className={isActive('/beneficiary') ? 'active' : ""}>
                    <ListItemButton className='sidbar_linkWrapper'>
                        <ListItemText primary="Beneficiery Management" className='sidebarLinkText'/>
                    </ListItemButton>
                </Link>
                <Link to='/invoices' className={isActive('/invoices') ? 'active' : ""}>
                    <ListItemButton className='sidbar_linkWrapper'>
                        <ListItemText primary="Disbursment" className='sidebarLinkText'/>
                    </ListItemButton>
                </Link>
                {/* {user_type && user_type==="l1" ? 
                <Link to='/invoices' className={isActive('/invoices')?'active':""}>
                <ListItemButton  className='sidbar_linkWrapper'>                    
                    <ListItemText primary="Disbursment" className='sidebarLinkText' />
                </ListItemButton>
                </Link> :""} */}
                <ListItemButton onClick={handleClickFundRealse}
                                className={FundReleaseOpen ? 'subMenuWrapper subMenuWrapper_top_border' : ''}>
                    <ListItemText primary="Payment Approval" className='sidebarLinkText'/>
                    {FundReleaseOpen ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={FundReleaseOpen} timeout="auto" unmountOnExit
                          className={FundReleaseOpen ? 'subMenuWrapper subMenuWrapper_bottom_border' : ''}>
                    <List component="div" disablePadding>
                        <Link to='/fund-invoice-list' className={isActive('/fund-invoice-list') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Invoice List" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                        <Link to='/fund-invoice-list?active=payment-status'
                              className={isActive('/fund-invoice-list?active=payment-status') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Payment Status" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>

                    </List>
                </Collapse>
                <ListItemButton onClick={handleClickReports}
                                className={reportsOpen ? 'subMenuWrapper subMenuWrapper_top_border' : ''}>
                    <ListItemText primary="Reports" className='sidebarLinkText'/>
                    {reportsOpen ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={reportsOpen} timeout="auto" unmountOnExit
                          className={reportsOpen ? 'subMenuWrapper subMenuWrapper_bottom_border' : ''}>
                    <List component="div" disablePadding>
                        <Link to='/interest' className={isActive('/interest') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Interest" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                        <Link to='/scheme-subhead' className={isActive('/scheme-subhead') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Scheme - Sub Head" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                        <Link to='/beneficiary-report' className={isActive('/beneficiary-report') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Beneficiary" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>

                        <Link to='/tds-it-report' className={isActive('/tds-it-report') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="TDS-IT" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>

                    </List>
                </Collapse>

                <ListItemButton onClick={handleClickreconciliation}
                                className={reconciliatinOpen ? 'subMenuWrapper subMenuWrapper_top_border' : ''}>
                    <ListItemText primary="Reconciliation" className='sidebarLinkText'/>
                    {reconciliatinOpen ? <ExpandLess/> : <ExpandMore/>}
                </ListItemButton>
                <Collapse in={reconciliatinOpen} timeout="auto" unmountOnExit
                          className={reconciliatinOpen ? 'subMenuWrapper' : ''}>
                    {user_type && user_type === "l2" ? <>
                        <List component="div" disablePadding>
                            <Link to='/payment-report'>
                                <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                    <ListItemText primary="Payment Report" className='sidebarLinkText'/>
                                </ListItemButton>
                            </Link>
                        </List>
                    </> : ""}
                </Collapse>

                <Collapse in={reconciliatinOpen} timeout="auto" unmountOnExit
                          className={reconciliatinOpen ? 'subMenuWrapper subMenuWrapper_bottom_border' : ''}>
                    <List component="div" disablePadding>
                        <Link to='/challan'
                              className={isActive('/challan') || isActive('/add-challan') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="IFMS Challan" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                        <Link to='/tds-it'
                              className={isActive('/tds-it') || isActive('/tds-it') ? 'active' : ""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="TDS-IT" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>
                        {/*<Link to='/add-challan' className={isActive('/add-challan')?'active':""}>
                            <ListItemButton sx={{pl: 4}} className='sidbar_linkWrapper'>
                                <ListItemText primary="Add IFMS Challan" className='sidebarLinkText'/>
                            </ListItemButton>
                        </Link>*/}
                    </List>
                </Collapse>

            </List>
        </div>
    )
}

export default Sidebar
