import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { categoryGetAllPayload, categoryIdPayload, categoryInstanceWithProductsPayload } from "./types";
import CategoryServices from "./services";
import type { productPayload } from "../product/types";

export const getCategoryList = {
  useQuery: (opt?: UseQueryOptions<categoryGetAllPayload[]>) =>
    useQuery({
      queryKey: ['getCategoryList'],
      queryFn: CategoryServices.getAllCategory,
      ...opt,
    })
};

export const categoryInstances = {
  useQuery: (catId: string, opt?: UseQueryOptions<categoryIdPayload>) => 
    useQuery({
      queryKey: ['categoryInstances', catId],
      queryFn: () => CategoryServices.categoryCatId(catId),
      enabled: !!catId,
      ...opt,
    })
};

export const categoryInstancesWithProducts = {
  useQuery: (catId: string, opt?: UseQueryOptions<categoryInstanceWithProductsPayload[]>) =>
    useQuery({
      queryKey: ['categoryInstancesWithProducts', catId],
      queryFn: () => CategoryServices.getCategoryInstancesWithProducts(catId),
      enabled: !!catId,
      ...opt,
    })
};

export const getProductbyCatInstance = {
  useQuery: (catId: string, opt?: UseQueryOptions<productPayload[]>) =>
    useQuery({
      queryKey: ['getProductbyCatInstance', catId],
      queryFn: () => CategoryServices.getProductByCatInstance(catId),
      enabled: !!catId,
      ...opt,
    })
};