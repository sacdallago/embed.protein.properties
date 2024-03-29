import storeComponentWrapper from '../stores/jobDispatcher';
import React from "react";
import {proteinStatus} from "../stores/JobParameters";
import {resultStatus} from "../stores/JobResults";
import PropTypes from "prop-types";

const ULR = "https://api.bioembeddings.com/api/annotations";

class FeaturesGrabber extends React.Component {
    constructor(props){
        super(props);

        this.protein = props.jobParameters.protein;
    }

    processGoPredSimResults = (json) => {
        // MAKE string for AMIGO viz
        // MFO
        let predictedMFOGraphData = {...json.predictedMFO};

        Object
            .keys(predictedMFOGraphData)
            .forEach(e => {
                let score = predictedMFOGraphData[e];
                let newValue = {
                    "title": e + "<br/> score:" + score,
                    "fill": score>= .28 ? "#FFFF99" : "#E5E4E2"
                };

                predictedMFOGraphData[e]= newValue
            });

        json['predictedMFOGraphDataString'] = encodeURIComponent(JSON.stringify(predictedMFOGraphData));
        // CCO
        let predictedCCOGraphData = {...json.predictedCCO};

        Object
            .keys(predictedCCOGraphData)
            .forEach(e => {
                let score = predictedCCOGraphData[e];
                let newValue = {
                    "title": e + "<br/> score:" + score,
                    "fill": score>= .29 ? "#FFFF99" : "#E5E4E2"
                };

                predictedCCOGraphData[e]= newValue
            });

        json['predictedCCOGraphDataString'] = encodeURIComponent(JSON.stringify(predictedCCOGraphData));
        // BPO
        let predictedBPOGraphData = {...json.predictedBPO};

        Object
            .keys(predictedBPOGraphData)
            .forEach(e => {
                let score = predictedBPOGraphData[e];
                let newValue = {
                    "title": e + "<br/> score:" + score,
                    "fill": score>= .35 ? "#FFFF99" : "#E5E4E2"
                };

                predictedBPOGraphData[e]= newValue
            });

        json['predictedBPOGraphDataString'] = encodeURIComponent(JSON.stringify(predictedBPOGraphData));

        return json
    };

    getFeatures = (sequence, embedder) => {
        fetch(ULR, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify({
                "sequence": sequence,
                "format": "legacy",
                "model": embedder
            }), // body data type must match "Content-Type" header
        })
            .then(response => response.json())
            .then(json => {
                if(embedder === "seqvec"){
                    json = this.processGoPredSimResults(json)
                }

                // TODO trigger new result
                this.props.action({
                    type: "SET_RESULT",
                    payload: {
                        embedder: embedder,
                        result: {
                            ...json,
                            status: resultStatus.DONE
                        }
                    }
                });
            })
            .catch(e => {
                console.error(e);

                this.props.action({
                    type: "SET_RESULT",
                    payload: {
                        embedder: embedder,
                        result: {
                            status: resultStatus.INVALID
                        }
                    }
                });
            })
        ;
    };

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;
        let jobResults = nextProps.jobResults;

        switch (jobParameters.proteinStatus) {
            case proteinStatus.UNIPROT:
            case proteinStatus.AA:
            case proteinStatus.FASTA:
            case proteinStatus.MULTIPLESEQUENCES:
                if(this.protein !== jobParameters.protein){
                    this.protein = jobParameters.protein;

                    this.props.action({
                        type: "RESET_RESULTS"
                    });

                    // this.getFeatures(jobParameters.protein.sequence, 'seqvec');
                    // this.getFeatures(jobParameters.protein.sequence, 'prottrans_bert_bfd');
                    this.getFeatures(jobParameters.protein.sequence, 'prottrans_t5_xl_u50');
                }
                break;
            case proteinStatus.LOADING:
            case proteinStatus.INVALID:
            default:
            // do nothing
        }
    }

    render() {
        return (<div/>);
    }
}

FeaturesGrabber.propTypes = {
    jobParameters: PropTypes.object,
    jobResults: PropTypes.object,
    action: PropTypes.func,
};

export default storeComponentWrapper(FeaturesGrabber);