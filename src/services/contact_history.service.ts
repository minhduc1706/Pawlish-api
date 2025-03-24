import { IContactHistory } from "../interfaces/contact_history.interface";
import { ContactHistory } from "../models/contact_history.model";


export const getContactHistoryByCustomerId = async (customerId: string): Promise<IContactHistory[]> => {
  const history = await ContactHistory.find({ customer_id: customerId })
    .populate("staff_id", "full_name")
    .sort({ date: -1 });
  return history;
};

export const createContactHistory = async (
  data: Omit<IContactHistory, "_id" | "createdAt" | "updatedAt">
): Promise<IContactHistory> => {
  const newHistory = new ContactHistory(data);
  await newHistory.save();
  return newHistory;
};