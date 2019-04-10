import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Protein, autodetect, validInput, parsers } from 'protein-parser';
import storeComponentWrapper from '../stores/jobDispatcher'
import {proteinStatus} from "../stores/JobParameters";
import delay from "../utils/ActionDelayer";
import classnames from 'classnames';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: "100%",
        height: "100%"
    },
    paper: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16
    }),
    underline: {
        textDecoration: "underline"
    }
});

class SequenceInput extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            proteinSequenceInput: ''
        };

        this.proteinStatusAction = "SET_PROTEIN_STATUS";
        this.jobParametersAction = "SET_JOB_PARAMETERS";

        this.handleChange = this.handleChange.bind(this);
        this.deleyedKeyUp = this.deleyedKeyUp.bind(this);
    }

    componentWillUnmount(){
        this.props.action({
            type: "RESET_JOB_SUBMISSION"
        });
    }

    handleChange() {
        let textInput = this.state.proteinSequenceInput;

        if(textInput.length < 3){
            this.props.action({
                type: this.proteinStatusAction,
                payload: {
                    proteinStatus: proteinStatus.INVALID
                }
            });
            return;
        }

        // It's going to be !== undefined only if a valid sequence or UniProt accession
        let retrievingFunction = autodetect(textInput);

        if(retrievingFunction !== undefined){
            retrievingFunction(textInput)
                .then(([proteins, _]) => {
                    if(proteins.length > 1 && proteins[0] !== undefined){
                        if(proteins[0].uniprotData !== undefined){
                            this.props.action({
                                type: this.jobParametersAction,
                                payload: {
                                    protein: proteins[0],
                                    proteinStatus: proteinStatus.UNIPROT
                                }
                            });
                        } else {
                            this.props.action({
                                type: this.jobParametersAction,
                                payload: {
                                    protein: proteins[0],
                                    proteinStatus: proteinStatus.MULTIPLESEQUENCES
                                }
                            });
                        }
                    } else if(proteins[0] !== undefined){

                        let parser = validInput(textInput);

                        if(parser === parsers.accession){
                            this.props.action({
                                type: this.jobParametersAction,
                                payload: {
                                    protein: proteins[0],
                                    proteinStatus: proteinStatus.UNIPROT
                                }
                            });
                        } else if(parser === parsers.fasta){
                            if(proteins[0].uniprotData !== undefined){
                                this.props.action({
                                    type: this.jobParametersAction,
                                    payload: {
                                        protein: proteins[0],
                                        proteinStatus: proteinStatus.UNIPROT
                                    }
                                });
                            } else {
                                this.props.action({
                                    type: this.jobParametersAction,
                                    payload: {
                                        protein: proteins[0],
                                        proteinStatus: proteinStatus.FASTA
                                    }
                                });
                            }
                        } else if(parser === parsers.protein_name){
                            this.props.action({
                                type: this.jobParametersAction,
                                payload: {
                                    protein: proteins[0],
                                    proteinStatus: proteinStatus.UNIPROT
                                }
                            });
                        } else if(parser === parsers.aa){
                            this.props.action({
                                type: this.jobParametersAction,
                                payload: {
                                    protein: proteins[0],
                                    proteinStatus: proteinStatus.AA
                                }
                            });
                        } else {
                            console.error("Unexpected error when validating protein retrieving function");
                            this.props.action({
                                type: "SET_PROTEIN_STATUS",
                                payload: {
                                    proteinStatus: proteinStatus.INVALID
                                }
                            });
                        }
                    } else {

                        this.props.action({
                            type: this.jobParametersAction,
                            payload: {
                                proteinStatus: proteinStatus.INVALID
                            }
                        });
                    }
                })
                .catch((e) => {
                    console.error(e);

                    this.props.action({
                        type: this.jobParametersAction,
                        payload: {
                            proteinStatus: proteinStatus.INVALID
                        }
                    });
                });
        } else {
            this.props.action({
                type: this.jobParametersAction,
                payload: {
                    proteinStatus: proteinStatus.INVALID
                }
            });
        }
    }

    loadSequence = type => event => {
        let fillerProtein =  new Protein("MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKMNLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEVVKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYRYYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFAFFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADEAKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVSNLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGYLAHAIHQVTK");

        fillerProtein.setUniprotData({
            accession: "P12345"
        });

        switch (type) {
            case 'fasta':
                this.setState({
                    proteinSequenceInput: `>My sequence
MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKM
NLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEV
VKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYR
YYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFA
FFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADE
AKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVS
NLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGY
LAHAIHQVTK`,
                });
                this.props.action({
                    type: this.jobParametersAction,
                    payload: {
                        proteinStatus: proteinStatus.FASTA,
                        protein: fillerProtein
                    }
                });
                break;

            case 'aa':
                this.setState({
                    proteinSequenceInput: "MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKMNLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEVVKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYRYYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFAFFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADEAKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVSNLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGYLAHAIHQVTK",
                });
                this.props.action({
                    type: this.jobParametersAction,
                    payload: {
                        proteinStatus: proteinStatus.AA,
                        protein: fillerProtein
                    }
                });
                break;

            case 'accession':
                this.setState({
                    proteinSequenceInput: "P12345",
                });
                this.props.action({
                    type: this.jobParametersAction,
                    payload: {
                        proteinStatus: proteinStatus.UNIPROT,
                        protein: fillerProtein
                    }
                });
                break;
            case 'protein_name':
                this.setState({
                    proteinSequenceInput: "AATM_RABIT",
                });
                this.props.action({
                    type: this.jobParametersAction,
                    payload: {
                        proteinStatus: proteinStatus.UNIPROT,
                        protein: fillerProtein
                    }
                });
                break;
            default:
                break;
        }
    };

    deleyedKeyUp(event) {

        this.setState({
            proteinSequenceInput: event.target.value
        });

        if(this.props.jobParameters.proteinStatus !== proteinStatus.LOADING){
            this.props.action({
                type: this.proteinStatusAction,
                payload: {
                    proteinStatus: proteinStatus.LOADING
                }
            });
        }

        delay("SEQUENCE_INPUT_CHANGE", this.handleChange, 1000);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Paper square elevation={2} className={classes.paper}>
                    <Typography variant="h6">
                        Sequence:
                    </Typography>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                            id="proteinSequenceInput"
                            multiline
                            data-gramm_editor={false}
                            className={classes.textField}
                            value={this.state.proteinSequenceInput}
                            onChange={this.deleyedKeyUp}
                            margin="normal"
                            autoFocus
                        />
                    </form>
                    <Typography component={"div"} variant="body1">
                        {'Sequence can be in '}
                        <strong className={classnames("pointer", classes.underline)} onClick={this.loadSequence('fasta')}>{"FASTA format"}</strong>
                        {', a '}
                        <strong className={classnames("pointer", classes.underline)} onClick={this.loadSequence('accession')}>{"UniProt Accession"}</strong>
                        {' number or '}
                        <strong className={classnames("pointer", classes.underline)} onClick={this.loadSequence('protein_name')}>{"UniProt Protein Name"}</strong>
                        {', or  '}
                        <strong className={classnames("pointer", classes.underline)} onClick={this.loadSequence('aa')}>{"AA sequence"}</strong>
                        .
                    </Typography>
                    <Typography component={"div"} variant="caption">
                        Click the bold text for examples.
                    </Typography>
                </Paper>
            </div>
        );
    }
}

SequenceInput.propTypes = {
    action: PropTypes.func,
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(SequenceInput));