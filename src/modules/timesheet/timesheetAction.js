import { postApi } from "../common/api"

export let dates = []; export let prevDay = "";
export let type1 = []; export let type2 = []; export let type3 = [];
export let type4 = []; export let type5 = [];
export let ctr = 0;

export const FORM_REQUEST = 'FORM_REQUEST_TS'
export const FORM_SUBMITTED = 'FORM_SUBMITTED_TS'
export const SUBMIT_FAILURE = 'SUBMIT_FAILURE_TS'

export function requestFormData(formData) {
    return {
        type: FORM_REQUEST,
        isFetching: true,
        formData
    }
}

export function receiveFormData() {
    return {
        type: FORM_SUBMITTED,
        isFetching: false
    }
}
export function submitError(message) {
    return {
        type: SUBMIT_FAILURE, SUBMIT_FAILURE,
        isFetching: false,
        showErrorMessage: true,
        errorMessage: message
    }
}

export function timesheetSubmit(formData) {
    let data = new FormData();

    data.append('name1', formData.name1);
    data.append('name2', formData.name2);

    return dispatch => {
        dispatch(requestFormData(formData))

        return postApi({
            url: '/timesheet/formsubmitted',
            dispatch,
            data,
            successCallBack: receiveFormData,
            failureCallback: submitError
        });
    }
}

export function displayDates() {
    dates.length = 0;
    type1 = []; type2 = []; type3 = []; type4 = []; type5 = [];
    let j = ctr;
    if (ctr <= 20) {
        for (let i = j + 6; i >= j; i--) {
            prevDay = new Date(new Date().setDate(new Date().getDate() - i));
            dates.push(prevDay);
            type1.push("a" + i); type2.push("b" + i); type3.push("c" + i); type4.push("d" + i); type5.push("e" + i);
            ctr++;
        }
    }
    return dates;
}

