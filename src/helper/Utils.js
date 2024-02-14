import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
export const CustomPagination = ({rowsPerPage, rowCount, currentPage, onChangePage}) => {
    const totalPages = Math.ceil(rowCount / rowsPerPage);
    const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);

    const paginationNumber = () => {
        if (pageNumbers.length <= 5) {
            return pageNumbers;
        } else if (pageNumbers.length >= 5 && currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', pageNumbers[pageNumbers.length - 1]];
        } else if (pageNumbers.length >= 5 && currentPage >= pageNumbers[pageNumbers.length - 4]) {
            return [1, '...', pageNumbers[pageNumbers.length - 5], pageNumbers[pageNumbers.length - 4], pageNumbers[pageNumbers.length - 3], pageNumbers[pageNumbers.length - 2], pageNumbers[pageNumbers.length - 1]];
        } else if (pageNumbers.length > 5 && currentPage > 4 && currentPage < pageNumbers[pageNumbers.length - 4]) {
            return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pageNumbers[pageNumbers.length - 1]];
        }
    };
    let paginationItms = paginationNumber();

    return (
        <div className='pt-3'>
            <span className='pb-2'>Total Rows: <b>{rowCount}</b></span>
            <Pagination className='mt-2'>
                {paginationItms.map((pageNumber, i) => (
                    <Pagination.Item
                        key={i}
                        onClick={() => onChangePage(pageNumber)}
                        disabled={(isNaN(pageNumber))}
                        active={(currentPage === pageNumber)}
                    >
                        {pageNumber}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
};
/*

export const CustomPagination = ({ rowsPerPage, rowCount, currentPage, onChangePage, onChangeRowsPerPage }) => {
    const totalPages = Math.ceil(rowCount / rowsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const paginationNumber = () => {
        if (pageNumbers.length <= 5) {
            return pageNumbers;
        } else if (pageNumbers.length >= 5 && currentPage <= 4) {
            return [1, 2, 3, 4, 5, '...', pageNumbers[pageNumbers.length - 1]];
        } else if (pageNumbers.length >= 5 && currentPage >= pageNumbers[pageNumbers.length - 4]) {
            return [1, '...', pageNumbers[pageNumbers.length - 5], pageNumbers[pageNumbers.length - 4], pageNumbers[pageNumbers.length - 3], pageNumbers[pageNumbers.length - 2], pageNumbers[pageNumbers.length - 1]];
        } else if (pageNumbers.length > 5 && currentPage > 4 && currentPage < pageNumbers[pageNumbers.length - 4]) {
            return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', pageNumbers[pageNumbers.length - 1]];
        }
    };

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = parseInt(e.target.value, 10);
        onChangeRowsPerPage(newRowsPerPage);
    };

    let paginationItms = paginationNumber();

    return (
        <div className='pt-3'>
            <span className='pb-2'>Total Rows: <b>{rowCount}</b></span>

            <Form.Group className='mt-2'>
                <Form.Label>Rows per Page:</Form.Label>
                <Form.Control
                    as='select'
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                >
                    {[5, 10, 25, 50].map((perPage, index) => (
                        <option key={index} value={perPage}>{perPage}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Pagination className='mt-2'>
                <Pagination.Item
                    onClick={() => onChangePage(1)}
                    disabled={currentPage === 1}
                >
                    First
                </Pagination.Item>

                {paginationItms.map((pageNumber, i) => (
                    <Pagination.Item
                        key={i}
                        onClick={() => onChangePage(pageNumber)}
                        disabled={(isNaN(pageNumber))}
                        active={(currentPage === pageNumber)}
                    >
                        {pageNumber}
                    </Pagination.Item>
                ))}

                <Pagination.Item
                    onClick={() => onChangePage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    Last
                </Pagination.Item>
            </Pagination>
        </div>
    );
};

*/

export const AlertComponent = () => {
    return (
        <>
            hello
        </>
    );
}


export const AddCommasToAmount = (amount) => {
    // Convert the amount to a string and split it into integer and decimal parts (if any)
    const [integerPart, decimalPart] = String(amount).split('.');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
    return formattedAmount;
}


export const numberToWords = (num) => {
    if (num === 0) {
        return 'zero';
    }

    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const getWordsForTwoDigitNumber = (num) => {
        if (num >= 11 && num <= 19) {
            return teens[num - 11];
        } else {
            const ten = Math.floor(num / 10);
            const remainder = num % 10;
            return (tens[ten] + (remainder !== 0 ? ' ' + units[remainder] : '')).trim();
        }
    };

    // Remove commas and convert to a number
    num = Number(num.replace(/,/g, ''));

    const numArray = Array.from(String(num), Number);
    let result = '';

    // Handle millions
    if (numArray.length > 6) {
        result += `${units[numArray[0]]} million `;
        numArray.shift();
    }

    // Handle thousands
    if (numArray.length > 3) {
        result += `${units[numArray[0]]} thousand `;
        numArray.shift();
    }

    // Handle hundreds
    if (numArray.length > 2 && numArray[0] !== 0) {
        result += `${units[numArray[0]]} hundred `;
        numArray.shift();
    }

    // Handle remaining two digits
    const twoDigitNumber = parseInt(numArray.join(''), 10);
    const wordsForTwoDigitNumber = getWordsForTwoDigitNumber(twoDigitNumber);
    result += wordsForTwoDigitNumber;

    return result.trim();
}


/*
export const numberToWords = (number) => {
    const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion", "trillion"];

    if (number === 0) {
        return "zero";
    }

    const numberStr = number.toString();

    // Pad the number with leading zeros to make it in chunks of 3 digits
    const paddedNumber = numberStr.padStart(Math.ceil(numberStr.length / 3) * 3, "0");

    let result = "";

    for (let i = 0; i < paddedNumber.length; i += 3) {
        const chunk = paddedNumber.slice(i, i + 3);
        const chunkNum = parseInt(chunk);

        if (chunkNum !== 0) {
            const chunkWords = [];

            const hundredsDigit = Math.floor(chunkNum / 100);
            const tensDigit = Math.floor((chunkNum % 100) / 10);
            const unitsDigit = chunkNum % 10;

            if (hundredsDigit !== 0) {
                chunkWords.push(units[hundredsDigit] + " hundred");
            }

            if (tensDigit === 1) {
                // For numbers between 10 and 19
                chunkWords.push(units[10 + unitsDigit]);
            } else {
                if (tensDigit !== 0) {
                    chunkWords.push(tens[tensDigit]);
                }

                if (unitsDigit !== 0) {
                    chunkWords.push(units[unitsDigit]);
                }
            }

            if (chunkWords.length > 0) {
                result = chunkWords.join(" ") + " " + thousands[i / 3] + " " + result;
            }
        }
    }
    // Remove any extra spaces and return the result
    return result.trim();
}
*/


export const get_file_ext = (file_url) => {
    if (file_url) {
        try {
            const parsedUrl = new URL(file_url);
            const pathname = parsedUrl.pathname;
            const fileType = pathname.split('.').pop();
            return fileType;
        } catch (error) {
            return null;
        }
    } else {
        return null;
    }
}

export const get_file_url_last_name = (file_url) => {
    if (file_url) {
        try {

            const filename = file_url.split('/').pop();
            return filename;
        } catch (error) {
            return '';
        }
    } else {
        return '';
    }
}

export const show_l1_action_btn = (user_type, l2_status, l3_status) => {
    if (user_type == 'l1') {
        if (l2_status == 1 || l3_status == 1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}


export const show_l1_action_btn_view = (user_type, l2_status, l3_status) => {
    if (user_type == 'l2') {
        if (l3_status == 2) {
            return false;
        } else {
            return true;
        }
    }
    if (user_type == 'l3') {
        if (l2_status == 2) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}


export const show_challan_edit_btn = (user_type, l2_status, l3_status) => {
    if (user_type == 'l1') {
        if ((l2_status == 0 || l3_status == 0)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export const show_invoice_edit_btn = (user_type, l2_status, l3_status) => {
    if (user_type == 'l1') {
        if ((l2_status == 2 || l3_status == 2)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export const check_is_equal_sanction_voucher_amount = (sanction_value, voucher_value_arr) => {
    if (sanction_value && voucher_value_arr) {
        sanction_value = parseInt(sanction_value);
        let total_voucher_value = 0;
        voucher_value_arr.forEach(voucher => {
            total_voucher_value += parseInt(voucher.total_voucher_value);
        });
        if (sanction_value == total_voucher_value) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

export const check_is_equal_voucher_invoices_amount = (voucher_value, invoice_value_arr) => {
    if (voucher_value && invoice_value_arr) {
        voucher_value = parseInt(voucher_value);
        let total_invoice_value = 0;
        invoice_value_arr.forEach(invoice => {
            total_invoice_value += parseInt(invoice.sanction_amount);
        });
        if (voucher_value == total_invoice_value) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}


export const check_is_equal_sanctioned_and_schemes_amount = (sanction_amount, scheme_amount_arr) => {
    if (sanction_amount && scheme_amount_arr) {
        sanction_amount = parseInt(sanction_amount);
        let total_scheme_amount = 0;
        scheme_amount_arr.forEach(scheme => {
            total_scheme_amount += parseInt(scheme.amount);
        });
        if (sanction_amount == total_scheme_amount) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}


export const isFilePdf_or_Image = (file) => {
    if (!file) return false;
    //'image/jpeg', 'image/png',
    const allowedFormats = ['application/pdf'];
    if (!allowedFormats.includes(file.type)) {
        return false;
    }
    // File size validation (e.g., 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        return false;
    }
    return true;
};


export const goback = () => {
    window.history.back();
}

export const get_schemes_entered_amount = (formData) => {

    const schemeAmounts = {};
    for (const voucher of formData.vouchers) {
        for (const invoice of voucher.invoices) {
            for (const scheme of invoice.schemes) {
                const schemeId = scheme.scheme_id;
                const amount = parseInt(scheme.amount);
                if (schemeId && amount >= 0) {
                    if (!schemeAmounts[schemeId]) {
                        schemeAmounts[schemeId] = {totalAmount: 0, subheads: {}};
                    }
                    schemeAmounts[schemeId].totalAmount += amount;

                    for (const subhead of scheme.subheads) {
                        // console.log(subhead)
                        if (subhead) {
                            let subHeadsId = subhead.sub_heads_id;
                            // console.log(subHeadsId)
                            const subHeadAmount = parseInt(subhead.sub_head_amount);
                            if (!subHeadsId || subHeadsId == 'NaN') {
                                subHeadsId = 0
                            }
                            // console.log(subHeadsId,subHeadAmount)
                            if (subHeadsId && subHeadAmount >= 0) {
                                if (!schemeAmounts[schemeId].subheads[subHeadsId]) {
                                    schemeAmounts[schemeId].subheads[subHeadsId] = 0;
                                }
                                schemeAmounts[schemeId].subheads[subHeadsId] += subHeadAmount;
                            }
                        }
                    }
                }
            }
        }
    }
    // console.log(schemeAmounts)
    return schemeAmounts;
}

export const get_schemes_entered_amount_in_edit_invoice = (formData) => {

    const schemeAmounts = {};
    for (const scheme of formData.schemes) {
        const schemeId = scheme.scheme_id;
        const amount = parseInt(scheme.amount);
        if (schemeId && amount >= 0) {
            if (!schemeAmounts[schemeId]) {
                schemeAmounts[schemeId] = {totalAmount: 0, subheads: {}};
            }
            schemeAmounts[schemeId].totalAmount += amount;

            for (const subhead of scheme.subheads) {
                // console.log(subhead)
                if (subhead) {
                    let subHeadsId = subhead.sub_heads_id;
                    // console.log(subHeadsId)
                    const subHeadAmount = parseInt(subhead.sub_head_amount);
                    if (!subHeadsId || subHeadsId == 'NaN') {
                        subHeadsId = 0
                    }
                    // console.log(subHeadsId,subHeadAmount)
                    if (subHeadsId && subHeadAmount >= 0) {
                        if (!schemeAmounts[schemeId].subheads[subHeadsId]) {
                            schemeAmounts[schemeId].subheads[subHeadsId] = 0;
                        }
                        schemeAmounts[schemeId].subheads[subHeadsId] += subHeadAmount;
                    }
                }
            }
        }
    }
    // console.log(schemeAmounts)
    return schemeAmounts;
}
