import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import {arrayToCSV, arrayToTSV} from '../utils/converters';

const styles = theme => ({
    root: {
        overflowX: 'auto',
        textAlign: "center",
        paddingBottom: theme.spacing.unit
    },
    underline: {
        textDecoration: "underline",
        cursor: "pointer"
    },
    title: {
        paddingTop: theme.spacing.unit
    },
    topSpace: {
        paddingTop: theme.spacing.unit*2,
        paddingBottom: theme.spacing.unit

    }
});

const formats = {
    JSON:'.json',
    TSV: '.tsv',
    CSV: '.csv',
};

class LocationTable extends React.Component {

    state = {
        result: [],
        loading: false
    };

    componentWillReceiveProps(newProps){
        this.props = newProps;

        let {ready, query} = newProps.data;

        if(ready){
            this.onQueryChange(query)
        }
    }

    download = (format) => () => {
        let dataStr;
        let {query} = this.props.data;

        switch (format) {
            case formats.CSV:
                dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(arrayToCSV(this.state.result));
                break;
            case formats.TSV:
                dataStr = "data:text/tsv;charset=utf-8," + encodeURIComponent(arrayToTSV(this.state.result));
                break;
            case formats.JSON:
            default:
                dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.result));
        }

        let dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", query + "_locations" + format);
        dlAnchorElem.click();
    };

    onQueryChange = (query) => {
        this.setState({
            loading: true
        }, () => {
            fetch("https://protein-locations.herokuapp.com/?q=" + query)
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        result: json,
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

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>
                <Typography className={classes.title} variant={"h6"}>
                    Protein sub-cellular locations
                </Typography>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">UniProt Accession</TableCell>
                            <TableCell align="center">Evidence</TableCell>
                            <TableCell align="center">Location</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.result.map(row => (
                            <TableRow key={row.accession + row.location + row.evidence}>
                                <TableCell component="th" scope="row">
                                    <a href={"https://www.uniprot.org/uniprot/"+row.accession} target={"_blank"} rel="noopener noreferrer">{row.accession}</a>
                                </TableCell>
                                <TableCell align="center"><a href={"https://www.ebi.ac.uk/QuickGO/term/"+row.evidence} target={"_blank"} rel="noopener noreferrer">{row.evidence}</a></TableCell>
                                <TableCell align="center"><a href={"https://www.uniprot.org/locations/?limit=4&sort=score&query="+row.location} target={"_blank"} rel="noopener noreferrer">{row.location}</a></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Typography className={classes.topSpace} component={"div"} variant="body1">
                    {'Download data in '}
                    <strong className={classes.underline} onClick={this.download(formats.JSON)}>{"JSON format"}</strong>
                    {', or '}
                    <strong className={classes.underline} onClick={this.download(formats.CSV)}>{"CSV format"}</strong>
                    {', or '}
                    <strong className={classes.underline} onClick={this.download(formats.TSV)}>{"TSV format"}</strong>
                    .
                </Typography>
            </Paper>
        );
    }
}

LocationTable.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired
};

export default withStyles(styles)(LocationTable);