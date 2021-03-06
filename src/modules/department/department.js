//import react
import React from 'react'
import ReactDOM from 'react-dom'

//import redux
import { connect } from 'react-redux'

//import third-party
import { Alert, Form, FormControl, FormGroup, Table, Checkbox } from 'react-bootstrap'
import { ControlLabel } from "react-bootstrap";
import trim from 'trim';

// import Dialog from 'react-bootstrap-dialog'
import Dialog from 'react-dialog'

//import local
import { getPropsMap } from './departmentReducer'
import { departmentSubmit, editSubmit, getAllData, deleteDepartment, getAllUsers } from './departmentAction'

//import css
import './department.scss'

let checkBoxArr = []; let departmentNameAlert = false; let departmentDescAlert = false; let showDelAlert = false; let delSuccessAlert = false;
let departmentHeadAlert = false;

class Department extends React.Component {
    constructor() {
        super();
        this.state = {
            isDialogOpen: false,
            isEditDialogOpen: false,
            isShowPage: true
        }
    }
    componentDidMount() {
        this.props.getData();
        this.props.getUsers();
    }
    componentWillReceiveProps() {
        this.props.getData();
    }

    openDialog = () => {
        this.setState({ isDialogOpen: true, isShowPage: false, isEditDialogOpen: false });
        departmentNameAlert = false; departmentDescAlert = false; showDelAlert = false; delSuccessAlert = false; departmentHeadAlert = false;
    }


    editData = '';
    openEditDialog = (row) => {
        this.editData = '';
        this.setState({ isEditDialogOpen: true, isShowPage: false, isDialogOpen: false });
        this.editData = row;
        console.log("editData is: " + this.editData);
        departmentNameAlert = false; departmentDescAlert = false; showDelAlert = false; delSuccessAlert = false; departmentHeadAlert = false;
    }


    handleClose = () => {
        this.setState({ isDialogOpen: false, isShowPage: true, isEditDialogOpen: false });
    }




    handleInputChange(event) {
        showDelAlert = false;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        console.log(value);
        const checkedvalue = target.name;
        console.log(checkedvalue);

        if (value == true) {
            checkBoxArr.push(checkedvalue);
        }
        if (value == false) {
            for (let i = 0; i < checkBoxArr.length; i++) {
                if (checkBoxArr[i] == checkedvalue) {
                    checkBoxArr.splice(i, 1);

                }
            }
        }
        console.log("checkboxarr is:" + checkBoxArr);
    }

    addReset = () => {
        document.getElementById("ahi-department-form").reset();
        departmentNameAlert = false; departmentDescAlert = false; showDelAlert = false; delSuccessAlert = false; departmentHeadAlert = false;
        this.setState({ isDialogOpen: true, isShowPage: false, isEditDialogOpen: false });
    }
    editReset = () => {
        document.getElementById("ahi-department-edit-form").reset();
        departmentNameAlert = false; departmentDescAlert = false; showDelAlert = false; delSuccessAlert = false; departmentHeadAlert = false;
        this.setState({ isDialogOpen: false, isShowPage: false, isEditDialogOpen: true });
    }


    render() {

        const { addSubmit, editSubmit, errorMessage, isFetching, departmentData, delData, usersData } = this.props;
        let departmentNameInput = ''; let descInput = ''; let headed_byInput = '';
        console.log("usersData is:" + JSON.stringify(usersData));
        console.log("departmentData is:" + departmentData);


        function handledelete() {
            if (checkBoxArr != '') {
                delSuccessAlert = true;
                console.log("deletedepartment is executing...");
                delData(checkBoxArr);

                checkBoxArr.length = 0;
            }
            else {
                console.log("delete alert is working");
                showDelAlert = true; delSuccessAlert = false;

            }

        }

        return (

            <div className="container">

                {this.state.isShowPage &&
                    <div className="panel">
                        <h1>DEPARTMENT</h1>
                    </div>
                }

                {this.state.isShowPage &&
                    <div className="panel">
                        {this.state.isShowPage &&
                            <div>
                                {showDelAlert ? (<Alert bsStyle="danger">Please Seelct a department!</Alert>) : null}
                                {/* {delSuccessAlert ? (<Alert bsStyle="success" >Your department is successfully deleted!</Alert>) : null} */}

                                <button type="button" onClick={this.openDialog} className="btn btn-primary adddisplay" >Add</button>
                                <button type="button" className="btn btn-danger deldisplay" onClick={handledelete} >Del</button>
                                <br /><br />
                            </div>
                        }
                        <br /><br />

                        {
                            departmentData != null &&
                            this.state.isShowPage &&
                            <div className="panel panel-blur">
                                <Table responsive bordered condensed hover className="tableStyle">
                                    <thead>
                                        {
                                            <tr>
                                                <th>Select</th>
                                                <th><ControlLabel>DepartmentName</ControlLabel></th>
                                                <th><ControlLabel>Description</ControlLabel></th>
                                                <th><ControlLabel>Headed By</ControlLabel></th>
                                            </tr>
                                        }

                                    </thead>
                                    <tbody>
                                        {departmentData.map((row) => {
                                            // console.log("row_id:" + row.departmentId);
                                            return <tr className="test">
                                                <td><Checkbox name={row.departmentId} onChange={this.handleInputChange}></Checkbox></td>
                                                <td><a onClick={() => this.openEditDialog(row)} title="Edit your department">{row.departmentName}</a></td>
                                                <td>{row.departmentDescription}</td>
                                                <td>{row.headedBy}</td>
                                            </tr>
                                        })
                                        }
                                    </tbody>
                                </Table>
                            </div>

                        }
                    </div>
                }
                <br />


                {this.state.isDialogOpen &&
                    <div className="panel">
                        <h1>ADD NEW DEPARTMENT</h1>
                    </div>
                }
                {this.state.isDialogOpen &&
                    <div className="panel">
                    {this.state.isDialogOpen &&
                        <div className="panel panel-blur">
                        <Form className="ahi-department-form" id="ahi-department-form" onSubmit={(e) => {
                            e.preventDefault();
                            let datas = ''; departmentDescAlert = false; departmentNameAlert = false; departmentHeadAlert = false;

                            departmentNameInput.value = trim(departmentNameInput.value);
                            descInput.value = trim(descInput.value);
                            console.log("deptNameInput is: " + departmentNameInput.value);

                            if (departmentNameInput.value != '' && descInput.value != '' && headed_byInput.value != 'select') {
                                datas = { departmentId: null, departmentName: departmentNameInput.value, departmentDescription: descInput.value, headedByUserId: headed_byInput.value };
                                addSubmit(datas);
                                this.handleClose();
                            }
                            else if (departmentNameInput.value == '') {
                                console.log("departmentname alert is working");
                                departmentNameAlert = true;
                                this.setState({ isDialogOpen: true, isShowPage: false, isEditDialogOpen: false });
                            }
                            else if (descInput.value == '') {
                                console.log("desc alert is working");
                                departmentDescAlert = true;
                                this.setState({ isDialogOpen: true, isShowPage: false, isEditDialogOpen: false });
                            }
                            else if (headed_byInput.value == 'select') {
                                console.log("Headed By alert is working");
                                departmentHeadAlert = true;
                                this.setState({ isDialogOpen: true, isShowPage: false, isEditDialogOpen: false });
                            }

                        }
                        }>
                            <FormGroup >
                                {errorMessage ? (<Alert bsStyle="danger"><strong>Error!</strong> {errorMessage}</Alert>) : null}
                            </FormGroup>

                            <FormGroup >
                                {isFetching ? (<Alert bsStyle="success" >Your Department is successfully Added!</Alert>) : null}
                            </FormGroup>

                            <FormGroup >
                                {departmentNameAlert ? (<Alert bsStyle="danger" >Please Enter department name!</Alert>) : null}
                            </FormGroup>
                            <FormGroup >
                                {departmentDescAlert ? (<Alert bsStyle="danger" >Please Enter department description!</Alert>) : null}
                            </FormGroup>
                            <FormGroup >
                                {departmentHeadAlert ? (<Alert bsStyle="danger" >Please Enter Headed By!</Alert>) : null}
                            </FormGroup>

                            <FormGroup controlId="formControlsSelect" className="ahi-department-name">
                                <ControlLabel>Department Name</ControlLabel>
                                <FormControl type="string" placeholder="enter DepartmentName"
                                    inputRef={(ref) => {
                                        departmentNameInput = ref
                                    }}
                                />
                            </FormGroup>

                            <FormGroup className="ahi-department-desc">
                                <ControlLabel>Description</ControlLabel>
                                <FormControl type="string" placeholder="enter description"
                                    inputRef={(ref) => {
                                        descInput = ref
                                    }}
                                />
                            </FormGroup>
                            <FormGroup controlId="formControlsSelect" className="form-inline1">
                                <ControlLabel >Headed By:</ControlLabel>&nbsp;
                                    <FormControl componentClass="select" placeholder="select" inputRef={
                                    (ref) => { headed_byInput = ref }
                                }>
                                    <option value="select" >select</option>
                                    {usersData.map(res => {
                                        return <option value={res.id}>{res.firstName} {res.lastName}</option>
                                    })
                                    }

                                </FormControl>
                            </FormGroup>
                            <br />

                            <FormGroup>
                                <button className="btn btn-primary canceldisplay" onClick={this.handleClose} >Cancel</button>
                                <button type="submit" className="btn btn-success  resetdisplay" >Submit</button>
                                <button type="button" className="btn btn-info  resetdisplay" onClick={this.addReset} >Reset</button>
                            </FormGroup>
                        </Form>
                    
                        <br />

                    </div>
                }
                </div>
            }

                {this.state.isEditDialogOpen &&
                    <div className="panel">
                        <h1>EDIT DEPARTMENT</h1>
                    </div>
                }
                {this.state.isEditDialogOpen &&
                    <div className="panel">
                    {this.state.isEditDialogOpen &&
                        <div className="panel panel-blur">
                        <Form className="ahi-department-form" id="ahi-department-edit-form" onSubmit={(e) => {
                            e.preventDefault();
                            let datas = '';
                            departmentNameAlert = false; departmentDescAlert = false; showDelAlert = false; delSuccessAlert = false; departmentHeadAlert = false;

                            if (departmentNameInput.value != '' && trim(departmentNameInput.value) == '') {
                                console.log("departmentNameAlert is working");
                                departmentNameAlert = true;
                                this.setState({ isEditDialogOpen: true, isShowPage: false, isDialogOpen: false });
                            }
                            else if (descInput.value != '' && trim(descInput.value) == '') {
                                console.log("departmentDescAlert is working");
                                departmentDescAlert = true;
                                this.setState({ isEditDialogOpen: true, isShowPage: false, isDialogOpen: false });
                            }
                            else {
                                departmentNameInput.value = trim(departmentNameInput.value);
                                descInput.value = trim(descInput.value);

                                if (departmentNameInput.value == '' && descInput.value != '' && headed_byInput.value != 'select') {
                                    datas = { departmentId: this.editData.departmentId, departmentName: this.editData.departmentName, departmentDescription: descInput.value, headedByUserId: headed_byInput.value }
                                }
                                else if (descInput.value == '' && departmentNameInput.value != '' && headed_byInput.value != 'select') {
                                    datas = { departmentId: this.editData.departmentId, departmentName: departmentNameInput.value, departmentDescription: this.editData.departmentDescription, headedByUserId: headed_byInput.value }
                                }
                                else if (descInput.value == '' && departmentNameInput.value == '' && headed_byInput.value != 'select') {
                                    datas = { departmentId: this.editData.departmentId, departmentName: this.editData.departmentName, departmentDescription: this.editData.departmentDescription, headedByUserId: headed_byInput.value }
                                }
                                else if (descInput.value == '' && departmentNameInput.value == '' && headed_byInput.value == 'select') {
                                    datas = { departmentId: this.editData.departmentId, departmentName: this.editData.departmentName, departmentDescription: this.editData.departmentDescription, headedByUserId: this.editData.headedByUserId }
                                }
                                else if (descInput.value == '' && departmentNameInput.value != '' && headed_byInput.value == 'select') {
                                    datas = { departmentId: this.editData.departmentId, departmentName: departmentNameInput.value, departmentDescription: this.editData.departmentDescription, headedByUserId: this.editData.headedByUserId }
                                }
                                else if (descInput.value != '' && departmentNameInput.value == '' && headed_byInput.value == 'select') {
                                    datas = { departmentId: this.editData.departmentId, departmentName: this.editData.departmentName, departmentDescription: descInput.value, headedByUserId: this.editData.headedByUserId }
                                }
                                else {
                                    datas = { departmentId: this.editData.departmentId, departmentName: departmentNameInput.value, departmentDescription: descInput.value, headedByUserId: headed_byInput.value }
                                }

                                editSubmit(datas);
                                this.handleClose();
                            }
                        }
                        }>
                            <FormGroup >
                                {errorMessage ? (<Alert bsStyle="danger"><strong>Error!</strong> {errorMessage}</Alert>) : null}
                            </FormGroup>

                            <FormGroup >
                                {isFetching ? (<Alert bsStyle="success" >Your Department is successfully Editted!</Alert>) : null}
                            </FormGroup>
                            <FormGroup >
                                {departmentNameAlert ? (<Alert bsStyle="danger" >Please Enter valid department name!</Alert>) : null}
                            </FormGroup>
                            <FormGroup >
                                {departmentDescAlert ? (<Alert bsStyle="danger" >Please Enter valid department description!</Alert>) : null}
                            </FormGroup>

                            <FormGroup controlId="formControlsSelect" className="ahi-department-name">
                                <ControlLabel>Department Name</ControlLabel>
                                <FormControl type="string" placeholder={this.editData.departmentName}
                                    inputRef={(ref) => {
                                        departmentNameInput = ref
                                    }}
                                />
                            </FormGroup>

                            <FormGroup className="ahi-department-desc">
                                <ControlLabel>Description</ControlLabel>
                                <FormControl type="string" placeholder={this.editData.departmentDescription}
                                    inputRef={(ref) => {
                                        descInput = ref
                                    }}
                                />
                            </FormGroup>
                            <FormGroup controlId="formControlsSelect" className="form-inline1">
                                <ControlLabel >Headed By:</ControlLabel>&nbsp;
                                    <FormControl componentClass="select" placeholder={this.editData.headedByUserId} inputRef={
                                    (ref) => { headed_byInput = ref }
                                }>

                                    {usersData.map(res => {
                                        if (this.editData.headedByUserId == res.id) {
                                            return <option value="select" >{res.firstName} {res.lastName}</option>
                                        }
                                    })}
                                    {usersData.map(res => {
                                        if (this.editData.headedByUserId != res.id) {
                                            return <option value={res.id}>{res.firstName} {res.lastName}</option>
                                        }
                                    })
                                    }
                                </FormControl>
                            </FormGroup>
                            <br />

                            <FormGroup>
                                <button className="btn btn-primary canceldisplay" onClick={this.handleClose} >Cancel</button>
                                <button type="submit" className="btn btn-success  resetdisplay" >Submit</button>
                                <button type="button" className="btn btn-info  resetdisplay" onClick={this.editReset} >Reset</button>
                            </FormGroup>
                        </Form>
                        <br />

                    </div>
                }
                </div>
            }

            </div>
        );
    }
}
const mapStateToProps = state => {
    return getPropsMap(state, 'department');
}
const DepartmentHome = connect(mapStateToProps, { getData: getAllData, addSubmit: departmentSubmit, editSubmit: editSubmit, delData: deleteDepartment, getUsers: getAllUsers })(Department);
export default DepartmentHome;

