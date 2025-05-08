import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataWithId, DeleteButtonProps } from "../../type";
import toast from "react-hot-toast";

function DeleteButton<TData extends DataWithId>({ table, deleteMultiRowsFn }: DeleteButtonProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const isRowSelected = table.getSelectedRowModel().rows.length > 0;

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
      if (deleteMultiRowsFn) {
        await deleteMultiRowsFn(selectedRowIds);
      }
      table.options.meta?.setData((prevData: TData[]) => prevData.filter((row) => !selectedRowIds.includes(row.id)));
      toast.success("Les statistiques ont bien été supprimées.");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la suppression des statistiques.");
    } finally {
      table.resetRowSelection();
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <motion.button
          key="delete-button"
          initial="hidden"
          animate={isRowSelected ? "visible" : "hidden"}
          variants={deleteButtonAnimation}
          className={cn(buttonVariants({ variant: "datatableOutlineDestructive", size: "none" }))}
          aria-label="Supprimer les lignes sélectionnées"
        >
          <Trash className="!size-6" />
        </motion.button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vous</AlertDialogTitle>
          <AlertDialogDescription>
            En confirmant cette action, vous supprimerez définitivement{" "}
            <span className="font-medium text-neutral-700">{table.getFilteredSelectedRowModel().rows.length}</span>{" "}
            ligne(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleDelete}>
            <Button variant="destructive" isLoading={isLoading} disabled={isLoading}>
              Supprimer
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteButton;

// ===================================================== Framer Motion Variants ====================================================================

const deleteButtonAnimation: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    transitionEnd: { display: "none" },
    transition: { duration: 0.075, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    scale: 1,
    display: "block",
    transition: { duration: 0.075, ease: "easeIn" },
  },
};
