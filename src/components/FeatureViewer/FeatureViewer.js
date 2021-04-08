import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import './featureViewer.scss';

const styles = theme => ({
    paper: {
        minHeight: 180
    }
});

class FeatureViewer extends React.Component {

    componentDidMount(){
        if(this.props.data !== null){
            this.ft = new window.FeatureViewer(this.props.data.sequence,
                '#fv1',
                {
                    showAxis: true,
                    showSequence: true,
                    brushActive: true, //zoom
                    toolbar:true, //current zoom & mouse position
                    bubbleHelp:true,
                    zoomMax:50 //define the maximum range of the zoom
                });
        }
    }

    findIndexes = (string, letters) => {
        let result = {};

        for(let j=0; j<letters.length;j++) {
            let indices = [];
            for(let i=0; i<string.length;i++) {
                if (string[i] === letters[j]) indices.push(i+1);
            }
            result[letters[j]] = indices;
        }

        return result;
    };

    findRanges = array => {
        array.sort((e,i) => e-i);

        let ranges = [{x: array[0], y: array[0]}];

        for(let i=1; i<array.length; i++){
            let currentRange = ranges[ranges.length-1];

            if(array[i] <= currentRange.y+1){
                currentRange.y = array[i];
            } else {
                ranges.push({x: array[i], y: array[i]});
            }
        }
        return ranges;
    };


    componentWillReceiveProps(newProps){
        if(newProps.data !== null){
            this.ft && this.ft.clearInstance();
            delete this.ft;
            document.getElementById("fv1").innerHTML = "";

            this.ft = new window.FeatureViewer(newProps.data.sequence,
                '#fv1',
                {
                    showAxis: true,
                    showSequence: true,
                    brushActive: true, //zoom
                    toolbar:true, //current zoom & mouse position
                    bubbleHelp:true,
                    zoomMax:50 //define the maximum range of the zoom
                });

            if(newProps.data.predictedDisorder){
                let disorder = this.findIndexes(newProps.data.predictedDisorder, ['X']);

                this.ft.addFeature({
                    data: this.findRanges(disorder['X']),
                    name: "Disorder",
                    color: "#0F8292",
                    type: "rect" // ['rect', 'path', 'line']
                });
            }

            if(newProps.data.predictedDSSP3){
                let secondaryStructure3 = this.findIndexes(newProps.data.predictedDSSP3, ['H', 'E', 'C']);

                this.ft.addFeature({
                    data: this.findRanges(secondaryStructure3['H']),
                    name: "DSSP3-Helix",
                    color: "#ccd96a",
                    type: "rect" // ['rect', 'path', 'line']
                });

                this.ft.addFeature({
                    data: this.findRanges(secondaryStructure3['E']),
                    name: "DSSP3-Sheet",
                    color: "#d958aa",
                    type: "rect" // ['rect', 'path', 'line']
                });

                this.ft.addFeature({
                    data: this.findRanges(secondaryStructure3['C']),
                    name: "DSSP3-Other",
                    color: "#4cd9c2",
                    type: "rect" // ['rect', 'path', 'line']
                });
            }

            // let secondaryStructure8 = this.findIndexes(newProps.data.predictedDSSP8, ['H', 'E', 'C', 'G', 'I', 'B', 'S', 'T']);
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['H']),
            //     name: "DSSP8-Helix",
            //     color: "#ccd96a",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['E']),
            //     name: "DSSP8-Sheet",
            //     color: "#d958aa",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['C']),
            //     name: "DSSP8-Other",
            //     color: "#4cd9c2",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['G']),
            //     name: "DSSP8-G",
            //     color: "#8ad970",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['I']),
            //     name: "DSSP8-I",
            //     color: "#d99657",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['B']),
            //     name: "DSSP8-B",
            //     color: "#d95633",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['S']),
            //     name: "DSSP8-S",
            //     color: "#6d3bd9",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
            //
            // this.ft.addFeature({
            //     data: this.findRanges(secondaryStructure8['T']),
            //     name: "DSSP8-T",
            //     color: "#3f54d9",
            //     type: "rect" // ['rect', 'path', 'line']
            // });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.paper} elevation={0}>
                <div className='use-bootstrap' id={"fv1"}>
                </div>
            </Paper>
        );
    }
}

FeatureViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object
};

export default withStyles(styles)(FeatureViewer);