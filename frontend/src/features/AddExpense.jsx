import { useContext, useState } from "react";
import ChooseExpensePrice from "../ui/ChooseExpensePrice";
import { PageContext } from "../contexts/PageContext";
import { createExpense } from "../services/api_expenses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDateForAPI } from "../utils/helpers";
import CategoriesPallet from "./CategoriesPallet";
import ButtonsPallet from "../ui/ButtonsPallet";
import toast from "react-hot-toast";

function AddExpense({ children }) {
  const [value, onChange] = useState(new Date().toISOString().split("T")[0]);

  const { chosenCategory, dispatch } = useContext(PageContext);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const onSubmit = async (data) => {
    if (!chosenCategory) {
      toast.error("Choose a category!");
      return;
    }
    const formattedDate = formatDateForAPI(value);
    mutate({
      categoryId: chosenCategory,
      amount: +data.amount,
      creationDate: formattedDate,
    });
    reinitializeCategory();
    navigateInitial();
  };

  function reinitializeCategory() {
    dispatch({ type: "pages/chooseCategory", payload: null });
  }

  function navigateInitial() {
    dispatch({ type: "pages/changePage", payload: "initial" });
  }

  return (
    <section className="flex flex-col items-center  bg-white shadow-appShadow sm:h-dvh sm:w-[650px]">
      <header className="mt-10 flex flex-col text-2xl font-bold">
        <p className="text-green-500">EXPENSES</p>
      </header>
      <ChooseExpensePrice value={value} onChange={onChange} onSubmit={onSubmit}>
        <p>Today on</p>
      </ChooseExpensePrice>

      <div className="mt-5 flex w-full justify-center">{children}</div>

      <div className="mt-5 flex w-full items-center justify-center px-9">
        <CategoriesPallet />
      </div>

      <ButtonsPallet cancelPageName="initial" formName="expenseAmountForm" />
    </section>
  );
}

export default AddExpense;
