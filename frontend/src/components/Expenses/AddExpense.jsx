import { Box, Drawer, IconButton, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { EXPENSE_CATEGORIES } from "../../../constants/categories"
import { expenseAPI } from "../../../services/api"

const AddExpense = ({ isOpen, onClose, onExpenseAdded }) => {
    const { formState: {
        errors,
        isSubmitting
    }, register, reset, handleSubmit } = useForm();


    const onSubmitExpense = async (data) => {
        try {
            if (!data.merchant) {
                delete data.merchant
            }
            await expenseAPI.addExpense(data);
            onExpenseAdded();
            onClose()
            reset()
            console.log(data);

        } catch (error) {
            console.log(error);

        }
    }
    return (
        <Drawer
            open={isOpen}
            anchor="right"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 2
            }}
            onClose={onClose}
            variant="temporary"
            slotProps={{
                paper: {
                    sx: {
                        width: 360
                    }
                }
            }}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: 1,
                borderColor: "divider"
            }}>
                <Typography variant="h6" component={"h2"}>Add New Expense</Typography>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </Box>
            <div className="h-100">
                <form className="form p-3" onSubmit={handleSubmit(onSubmitExpense)}>
                    <div className="form-group mb-3">
                        <label htmlFor="amount" className="form-label">Amount <span className="text-danger">*</span></label>
                        <input type="number" required className="form-control" placeholder="Enter expense amount" {...register("amount", {
                            required: "Amount is required.",
                            min: {
                                value: 1,
                                message: "Amount cannot be <= 0"
                            }
                        })} />
                        {errors.amount && <p className="text-danger text-end">{errors.amount.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="description" className="form-label">Description <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" placeholder="Enter Description" {...register("description", {
                            required: "Description is required."
                        })} />
                        {errors.description && <p className="text-danger text-end">{errors.description.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="merchant" className="form-label">Merchant <span className="text-muted fs-6">(Optional)</span></label>
                        <input type="text" className="form-control" placeholder="Enter Merchant Name" {...register("merchant")} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="date" className="form-label">Date <span className="text-danger">*</span></label>
                        <input type="date" required className="form-control" placeholder="Enter Date of Expense" {...register("date", {
                            required: "Date is required.",
                        })} />
                        {errors.date && <p className="text-danger text-end">{errors.date.message}</p>}
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="category" className="form-label">Category <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            defaultValue={""}
                            {...register("category", {
                                required: "Please select a category"
                            })}>
                            <option value={""}>Choose an expense category</option>
                            {
                                EXPENSE_CATEGORIES.map((exp) => {
                                    return <option key={exp} value={exp}>{exp}</option>
                                })
                            }

                        </select>
                        {errors.category && <p className="text-danger text-end">{errors.category.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">Add My Expense</button>
                </form>
            </div>
        </Drawer>
    )
}

export default AddExpense