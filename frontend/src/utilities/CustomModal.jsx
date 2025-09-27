import * as React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from '@react-spring/web';
import { useForm } from 'react-hook-form';

const Fade = React.forwardRef(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function CustomModal({ open, handleClose }) {
    const { register, handleSubmit, formState: {
        errors,
        isSubmitting
    } } = useForm();

    const handleResetPassword = (data) => {
        console.log(data);

    }
    return (
        <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    TransitionComponent: Fade,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography id="spring-modal-title" variant="h6" component="h2">
                        Enter email for reset link
                    </Typography>
                    <Box>
                        <form onSubmit={handleSubmit(handleResetPassword)}>
                            <div className="form-group mt-3">
                                <input type="email" placeholder='Enter email' className='form-control' {...register('email', {
                                    required: "Please enter email"
                                })} />
                                {errors.email && <p className='text-danger text-end'>{errors.email.message}</p>}
                            </div>
                            <button disabled={isSubmitting} type='submit' className='btn btn-primary w-100 mt-3'>Send Reset Link</button>
                        </form>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
}