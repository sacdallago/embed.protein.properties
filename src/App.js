import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LocationTable from './LocationTable';
import Typography from "@material-ui/core/Typography/Typography";
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    attribution: {
        textAlign: "center",
        marginTop: theme.spacing.unit * 2
    },
    root: {
        maxWidth: 1100,
        margin: "auto",
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2
    },
    search: {
        width: "100%"
    },
    textField: {
        width: "100%",
        textAlign: "center"
    }
});

const uniprotRegex = /^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/;


class App extends React.Component {
    state = {
        query: '',
        valid: true,
        ready: false
    };

    timeout = null;

    onQueryChange = (query) => {
        if(uniprotRegex.test(query)){
            this.setState({
                valid: true,
                ready: true
            });
        } else {
            this.setState({
                valid: false,
            })
        }
    };

    onInputChange = (event) => {
        let value = event.target.value;

        if(uniprotRegex.test(value)){
            this.setState({
                query: value,
                ready: false
            });
            window.clearTimeout(this.timeout);
            this.onQueryChange(value)
        } else {
            this.setState({
                query: value,
                ready: false
            });

            window.clearTimeout(this.timeout);
            this.timeout = setTimeout(()=>{
                this.onQueryChange(value)
            }, 1000);
        }
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid container className={classes.root} spacing={0}>
                <Grid item xs={3} />
                <Grid item className={classes.search} xs={6}>
                    <TextField
                        id="query"
                        label="UniProt Accession"
                        className={classes.textField}
                        value={this.state.query}
                        onChange={this.onInputChange}
                        margin="normal"
                        variant="outlined"
                        error={!this.state.valid}
                    />
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={false} md={2} xl={2} />
                <Grid item className={classes.search} xs={12} md={8} xl={8}>
                    <LocationTable data={this.state} />
                </Grid>
                <Grid item xs={false} md={2} xl={2} />
                <Grid item className={classes.search} xs={12}>
                    <Typography variant={"caption"} className={classes.attribution}>
                        Måde by <a rel="noopener noreferrer" href="https://christian.dallago.us" target="_blank">Christian Dallago</a>.
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);