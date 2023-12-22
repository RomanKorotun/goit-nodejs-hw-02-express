import { HttError } from "../helpers/index.js";
import {
  contactAddShema,
  contactUpdateFavoriteShema,
  contactUpdateShema,
} from "../models/Contact.js";
import Contact from "../models/Contact.js";

const getAll = async (req, res, next) => {
  try {
    const data = await Contact.find();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findById(id);
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
    const data = await Contact.create(req.body);
    res.status(201).json(data);
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
    const data = await Contact.findByIdAndUpdate(id, req.body);
    if (data === null) {
      throw HttError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = contactUpdateFavoriteShema.validate(req.body);
    if (error) {
      throw HttError(400, error.message);
    }
    const { id } = req.params;
    const data = await Contact.findByIdAndUpdate(id, req.body);
    if (data === null) {
      throw HttError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Contact.findByIdAndDelete(id);
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

export default {
  getAll,
  getById,
  add,
  updateById,
  updateStatusContact,
  deleteById,
};
