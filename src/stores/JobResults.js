const status = {
    INVALID: 0,
    LOADING: 2,
    NULL: 3,
    DONE: 4
};

const placeholder = {
    sequence: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    predictedSubcellularLocalizations: " ",
    predictedMembrane: " ",
    predictedBPO:{},
    predictedBPOGraphDataString: "",
    predictedCCO:{},
    predictedCCOGraphDataString: "",
    predictedMFO:{},
    predictedMFOGraphDataString: "",
    predictedDSSP3: " ",
    predictedDSSP8: " ",
    predictedDisorder: " ",
    status: status.NULL
};

const initial = {
    prottrans_t5_xl_u50: placeholder,
    prottrans_bert_bfd: placeholder,
    seqvec: placeholder
};

function JobResults(state = initial, action) {
    switch (action.type) {
        case 'SET_RESULT':
            return {
                ...state,
                [action.payload.embedder]: action.payload.result
            };

        case 'RESET_RESULTS':
            return initial;

        default:
            return state;
    }
}

export default JobResults;

export const resultStatus = status;