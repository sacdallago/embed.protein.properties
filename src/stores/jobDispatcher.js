import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = ({ jobParameters }) =>
    ({ jobParameters });

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        action: (a) => {
            return a
        },
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps);