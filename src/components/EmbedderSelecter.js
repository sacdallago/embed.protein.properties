import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import storeComponentWrapper from '../stores/jobDispatcher';
import { proteinStatus } from "../stores/JobParameters";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';



const styles = theme => ({
    content: {
        flex: '1 1 auto',
    },
    group: {
        flexDirection: "row",
        justifyContent: "center"
    }
});


class EmbedderSelecter extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,
        };

    }

    componentWillReceiveProps(nextProps) {

        let jobParameters = nextProps.jobParameters;

        this.setState({
            proteinStatus: jobParameters.proteinStatus,
            protein: jobParameters.protein
        })
    }

    render() {
        const { classes } = this.props;

        return <div>
            <RadioGroup
                aria-label="embedder"
                className={classes.group}
                value={this.props.jobParameters.embedder}
                onChange={(target, value) => {
                    this.props.action({
                        type: "SET_JOB_PARAMETERS",
                        payload: {
                            embedder: value
                        }
                    });
                }}
            >
                <FormControlLabel
                    value="seqvec"
                    control={<Radio color="primary" />}
                    label="SeqVec"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="prottrans_bert_bfd"
                    control={<Radio color="primary" />}
                    label="ProtTrans BERT BFD (ProtBert)"
                    labelPlacement="start"
                />
                <FormControlLabel
                    value="prottrans_t5_xl_u50"
                    control={<Radio color="primary" />}
                    label="ProtTrans T5 XL U50 (ProtT5)"
                    labelPlacement="start"
                />
            </RadioGroup>
        </div>
    }
}

EmbedderSelecter.propTypes = {
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(EmbedderSelecter));