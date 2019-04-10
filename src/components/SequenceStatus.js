import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import storeComponentWrapper from '../stores/jobDispatcher';
import { proteinStatus } from "../stores/JobParameters";
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Info from '@material-ui/icons/InfoOutlined';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import CircularProgress from '@material-ui/core/CircularProgress';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';

const styles = theme => ({
    greenAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: green[500],
    },
    redAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: red[500],
    },
    orangeAvatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: orange[500],
    },
    grayLoading: {
        margin: 10,
        color: '#aeaeae',
        backgroundColor: 'inherit'
    },
    grid: theme.mixins.gutters({
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }),
    avatar: {
        flex: '0 0 auto',
        marginRight: theme.spacing.unit * 2,
    },
    content: {
        flex: '1 1 auto',
    },
});


class SequenceStatus extends React.Component {

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

        switch (this.state.proteinStatus) {
            case proteinStatus.UNIPROT:
                return (<Paper square elevation={2} >
                    <div className={classes.grid}>
                        <div className={classes.avatar}>
                            <Avatar className={classes.greenAvatar}>
                                <Check />
                            </Avatar>
                        </div>
                        <div className={classes.content}>
                            <Typography variant={"body2"}
                                        component="div"
                                        color="textSecondary">
                                Valid identifier passed. The sequence from {' '}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={"https://uniprot.org/uniprot/" + (this.state.protein && this.state.protein.uniprotData ? this.state.protein.uniprotData.accession : "P12345")}>
                                    {(this.state.protein && this.state.protein.uniprotData ? this.state.protein.uniprotData.accession : "P12345")}
                                </a>
                                {' '} will be used.
                            </Typography>
                        </div>
                    </div>
                </Paper>);
            case proteinStatus.AA:
            case proteinStatus.FASTA:
                return (<Paper square elevation={2} >
                    <CardHeader
                        avatar={
                            <Avatar className={classes.greenAvatar}>
                                <Check />
                            </Avatar>
                        }
                        subheader="Valid sequence passed."
                    />
                </Paper>);
            case proteinStatus.INVALID:
                return (<Paper square elevation={2} >
                    <CardHeader
                        avatar={
                            <Avatar className={classes.redAvatar}>
                                <Close />
                            </Avatar>
                        }
                        subheader="Sorry, but it was not possible to identify your sequence or identifier."
                    />
                </Paper>);
            case proteinStatus.LOADING:
                return (<Paper square elevation={2} >
                    <CardHeader
                        avatar={
                            <CircularProgress className={classes.grayLoading}/>
                        }
                        subheader="Checking validity."
                    />
                </Paper>);
            case proteinStatus.MULTIPLESEQUENCES:
                return (<Paper square elevation={2} >
                    <CardHeader
                        avatar={
                            <Avatar className={classes.orangeAvatar}>
                                <Check />
                            </Avatar>
                        }
                        subheader="You inputted valid sequences, but only the first sequence will be considered."
                    />
                </Paper>);
            default:
                return <Paper square elevation={2} >
                    <CardHeader
                        avatar={
                            <Avatar className={classes.grayLoading}>
                                <Info />
                            </Avatar>
                        }
                        subheader="Input a sequence to start!"
                    />
                </Paper>
        }
    }
}

SequenceStatus.propTypes = {
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(SequenceStatus));