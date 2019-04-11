import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import storeComponentWrapper from '../stores/jobDispatcher';
import { proteinStatus } from "../stores/JobParameters";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import SequenceHighlighter from "./SequenceHighlighter";
import {proteinColorSchemes} from "../utils/Graphics";

const styles = theme => ({
});

const ULR = "http://localhost:5000/features";


class Features extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,
            protein: null,
            features: null,
            loading: false
        };
    }

    getFeatures = (sequence) => {
        this.setState({
            loading: true
        }, () => {
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
                    "sequence": sequence
                }), // body data type must match "Content-Type" header
            })
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        features: json,
                        loading: false
                    })
                })
                .catch(e => {
                    console.error(e);
                    this.setState({
                        loading: false
                    })
                })
            ;
        });
    };

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;

        switch (jobParameters.proteinStatus) {
            case proteinStatus.UNIPROT:
            case proteinStatus.AA:
            case proteinStatus.FASTA:
            case proteinStatus.MULTIPLESEQUENCES:
                this.getFeatures(jobParameters.protein.sequence);
                break;
            case proteinStatus.LOADING:
            case proteinStatus.INVALID:
            default:
                // do nothing

        }

        this.setState({
            proteinStatus: jobParameters.proteinStatus,
        });
    }

    render() {
        const { classes } = this.props;

        // <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>

        switch (this.state.proteinStatus) {
            case proteinStatus.UNIPROT:
            case proteinStatus.AA:
            case proteinStatus.FASTA:
            case proteinStatus.MULTIPLESEQUENCES:
                return (<Grid container spacing={16}>
                    <Grid item>
                        <Paper>
                            <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>
                            {this.state.features && <SequenceHighlighter string={this.state.features.sequence} proteinColorScheme={proteinColorSchemes['mview']}/>}
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper>
                            <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>
                            {this.state.features && <SequenceHighlighter string={this.state.features.predicted_dssp3} proteinColorScheme={proteinColorSchemes['dssp8']}/>}
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper>
                            <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>
                            {this.state.features && <SequenceHighlighter string={this.state.features.predicted_dssp8} proteinColorScheme={proteinColorSchemes['dssp8']}/>}
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper>
                            <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>
                            {this.state.features && <SequenceHighlighter string={this.state.features.predicted_disorder} proteinColorScheme={proteinColorSchemes['disorder']}/>}
                        </Paper>
                    </Grid>
                </Grid>);
            case proteinStatus.LOADING:
            case proteinStatus.INVALID:
            default:
                return (<Grid container spacing={0}>
                </Grid>);
        }
    }
}

Features.propTypes = {
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(Features));