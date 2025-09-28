import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import { useForm } from "react-hook-form";
import { expenseAPI } from "../../../services/api";

const Fade = React.forwardRef(function Fade(props, ref) {
    const { children, in: open, onClick, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) onEnter(null, true);
        },
        onRest: () => {
            if (!open && onExited) onExited(null, true);
        },
    });

    const AnimatedDiv = animated.div;
    return (
        <AnimatedDiv ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </AnimatedDiv>
    );
});

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
};

export default function ImportExpenses({ open, onClose, onImported }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
        clearErrors,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            clearErrors();
            await expenseAPI.importExpenses({
                bankAccountId: data.accountNumber,
            });

            if (onImported) await onImported();
            reset();
            onClose?.();
        } catch (err) {
            console.error("Import failed", err);
            setError("root", {
                type: "server",
                message:
                    err?.response?.data?.message ||
                    "Failed to import expenses. Please try again.",
            });
        }
    };

    return (
        <Modal
            aria-labelledby="import-expenses-title"
            aria-describedby="import-expenses-description"
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { TransitionComponent: Fade } }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography
                        id="import-expenses-title"
                        variant="h6"
                        component="h2"
                        gutterBottom
                    >
                        Import expenses from your bank
                    </Typography>
                    <Typography
                        id="import-expenses-description"
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Enter your bank account number to fetch recent
                        transactions and add them to your expenses.
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mt-2">
                            <label
                                htmlFor="accountNumber"
                                className="form-label"
                            >
                                Bank Account Number
                            </label>
                            <input
                                id="accountNumber"
                                type="text"
                                placeholder="e.g. 123456789012"
                                className="form-control"
                                {...register("accountNumber", {
                                    required: "Account number is required",
                                    minLength: {
                                        value: 8,
                                        message: "Must be at least 8 digits",
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: "Must be at most 20 digits",
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Digits only",
                                    },
                                })}
                            />
                            {errors.accountNumber && (
                                <p className="text-danger text-end mt-1">
                                    {errors.accountNumber.message}
                                </p>
                            )}
                        </div>

                        {/* Server error */}
                        {errors.root && (
                            <p className="text-danger text-end mt-2">
                                {errors.root.message}
                            </p>
                        )}

                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="btn btn-primary w-100 mt-3"
                        >
                            {isSubmitting ? "Importing..." : "Import"}
                        </button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    );
}
