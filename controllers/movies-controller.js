import { HttError } from "../helpers/index.js";
import * as contactsService from "../models/contacts/index.js";
import {
  contactAddShema,
  contactUpdateShema,
} from "../shemas/contacts-shema.js";

const getAll = async (req, res, next) => {
  try {
    const data = await contactsService.listContacts();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);
    if (data === null) {
      throw HttError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { error } = contactAddShema.validate(req.body);
    if (error) {
      throw HttError(400, error.message);
    }
    const data = await contactsService.addContact(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await contactsService.removeContact(id);
    if (data === null) {
      throw HttError(404);
    }
    res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { error } = contactUpdateShema.validate(req.body);
    if (error) {
      throw HttError(400, error.message);
    }
    const { id } = req.params;
    const data = await contactsService.updateContact(id, req.body);
    if (data === null) {
      throw HttError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
};
