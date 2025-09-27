import { useForm } from "react-hook-form";

import { useAuth } from "../../hooks/useAuth";

import { budgetAPI } from "../../services/api";

import { useNavigate } from "react-router-dom";

const Settings = () => {
    const { user, checkAuthStatus } = useAuth();

    const navigate = useNavigate();

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm();

    const handleOnSubmit = async (data) => {
        try {
            await budgetAPI.setSalaryBreakdown(data);

            await checkAuthStatus();

            navigate("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="container-fluid">
            <h2>Settings</h2>

            <div className="row">
                <form
                    className="form col-12 col-md-6"
                    onSubmit={handleSubmit(handleOnSubmit)}
                >
                    <div className="form-group mt-3">
                        <label htmlFor="salary" className="form-label">
                            Salary
                        </label>

                        <input
                            defaultValue={user?.salary}
                            type="number"
                            className="form-control"
                            placeholder="Enter Salary"
                            {...register("salary", {
                                required: "Salary is required",

                                min: 0,
                            })}
                        />

                        {errors.salary && (
                            <p className="text-danger">
                                {errors.salary.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group mt-3">
                        <h2 className="">
                            Breakdown{" "}
                            <span className="text-muted fs-6">
                                (How you want to handle your salary)
                            </span>
                        </h2>

                        <div className="form-group mt-3">
                            <label htmlFor="savings" className="form-label">
                                Savings
                            </label>

                            <input
                                defaultValue={user?.breakdown.savings}
                                type="number"
                                className="form-control"
                                placeholder="Enter Savings"
                                {...register("savings", {
                                    required: "Savings is required",

                                    min: 0,
                                })}
                            />

                            {errors.savings && (
                                <p className="text-danger">
                                    {errors.savings.message}
                                </p>
                            )}
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="expenses" className="form-label">
                                Expenses
                            </label>

                            <input
                                defaultValue={user?.breakdown.expenses}
                                type="number"
                                className="form-control"
                                placeholder="Enter Expenses"
                                {...register("expenses", {
                                    required: "Expenses is required",

                                    min: 0,
                                })}
                            />

                            {errors.expenses && (
                                <p className="text-danger">
                                    {errors.expenses.message}
                                </p>
                            )}
                        </div>

                        <div className="form-group mt-3">
                            <label htmlFor="misc" className="form-label">
                                Miscellaneous
                            </label>

                            <input
                                defaultValue={user?.breakdown.misc}
                                type="number"
                                className="form-control"
                                placeholder="Enter Miscellaneous"
                                {...register("misc", {
                                    required: "Misc is required",

                                    min: 0,
                                })}
                            />

                            {errors.misc && (
                                <p className="text-danger">
                                    {errors.misc.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="btn btn-primary mt-3"
                    >
                        Set breakdown
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Settings;
