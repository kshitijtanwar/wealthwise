import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { EXPENSE_CATEGORIES } from "../../../constants/categories";
import { budgetAPI } from "../../../services/api";

const durations = [
   { label: "Weekly", value: "weekly" },
   { label: "Monthly", value: "monthly" },
   { label: "Yearly", value: "yearly" },
];

const AddBudget = ({ isOpen, onClose, onBudgetAdded }) => {
   const {
       formState: { errors, isSubmitting },
       register,
       reset,
       handleSubmit,
   } = useForm();

   const onSubmitBudget = async (data) => {
       try {
           await budgetAPI.setBudget(data);
           onBudgetAdded();
           onClose();
           reset();
           console.log(data);
       } catch (error) {
           console.log(error);
       }
   };

   return (
       <Drawer
           open={isOpen}
           anchor="right"
           sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
           onClose={onClose}
           variant="temporary"
           slotProps={{
               paper: { sx: { width: 360 } },
           }}
       >
           <Box
               sx={{
                   display: "flex",
                   justifyContent: "space-between",
                   alignItems: "center",
                   p: 2,
                   borderBottom: 1,
                   borderColor: "divider",
               }}
           >
               <Typography variant="h6" component={"h2"}>
                   Add New Budget
               </Typography>
               <IconButton onClick={onClose} size="small">
                   <Close />
               </IconButton>
           </Box>
           <div className="h-100">
               <form className="form p-3" onSubmit={handleSubmit(onSubmitBudget)}>
                   <div className="form-group mb-3">
                       <label htmlFor="amount" className="form-label">
                           Amount <span className="text-danger">*</span>
                       </label>
                       <input
                           type="number"
                           required
                           className="form-control"
                           placeholder="Enter budget amount"
                           {...register("amount", {
                               required: "Amount is required.",
                               min: { value: 1, message: "Amount must be greater than 0" },
                           })}
                       />
                       {errors.amount && <p className="text-danger text-end">{errors.amount.message}</p>}
                   </div>

                   <div className="form-group mb-3">
                       <label htmlFor="category" className="form-label">
                           Category <span className="text-danger">*</span>
                       </label>
                       <select
                           className="form-select"
                           defaultValue={""}
                           {...register("category", { required: "Please select a category" })}
                       >
                           <option value={""}>Choose a budget category</option>
                           {EXPENSE_CATEGORIES.map((cat) => (
                               <option key={cat} value={cat}>
                                   {cat}
                               </option>
                           ))}
                       </select>
                       {errors.category && <p className="text-danger text-end">{errors.category.message}</p>}
                   </div>

                   <div className="form-group mb-3">
                       <label htmlFor="duration" className="form-label">
                           Duration <span className="text-danger">*</span>
                       </label>
                       <select
                           className="form-select"
                           defaultValue={""}
                           {...register("duration", { required: "Please select a duration" })}
                       >
                           <option value={""}>Select duration</option>
                           {durations.map(({ label, value }) => (
                               <option key={value} value={value}>
                                   {label}
                               </option>
                           ))}
                       </select>
                       {errors.duration && <p className="text-danger text-end">{errors.duration.message}</p>}
                   </div>

                   <button type="submit" disabled={isSubmitting} className="btn btn-primary w-100">
                       Add My Budget
                   </button>
               </form>
           </div>
       </Drawer>
   );
};

export default AddBudget;
