import { HttpError } from "../helpers/index.js";
import {
  contactAddShema,
  contactUpdateFavoriteShema,
  contactUpdateShema,
} from "../models/Contact.js";
import Contact from "../models/Contact.js";

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const skip = (page - 1) * limit;
    const { _id: owner } = req.user;
    if (favorite !== undefined) {
      const data = await Contact.find(
        { owner, favorite },
        "-createdAt -updatedAt",
        {
          skip,
          limit,
        }
      ).populate("owner", "email");
      res.json(data);
      return;
    }
    const data = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email");
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const data = await Contact.findOne({ _id, owner }).populate(
      "owner",
      "email"
    );
    if (data === null) {
      throw HttpError(404);
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
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const data = await Contact.create({ ...req.body, owner });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { error } = contactUpdateShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const data = await Contact.findOneAndUpdate(
      { _id, owner },
      req.body
    ).populate("owner", "email");
    if (data === null) {
      throw HttpError(404);
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
      throw HttpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const data = await Contact.findOneAndUpdate(
      { _id, owner },
      req.body
    ).populate("owner", "email");
    if (data === null) {
      throw HttpError(404);
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { id: _id } = req.params;
    const data = await Contact.findOneAndDelete({ _id, owner });
    if (data === null) {
      throw HttpError(404);
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
