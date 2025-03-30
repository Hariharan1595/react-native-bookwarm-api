import cloudinary from "../lib/cloudinary.js";
import Book from "../models/book.model.js";

export const createBook = async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const uploadRes = await cloudinary.uploader.upload(image);
    const imgURL = uploadRes.secure_url;

    res.status(201).json({
      title,
      caption,
      image: imgURL,
      rating,
      user: req.user._id,
    });
  } catch (error) {
    res.status(400).json("Something went wrong");
    console.log(error);
  }
};

export const getBooks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profilePic");

    const totalBooks = await Book.countDocuments();

    res.status(200).json({
      books,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    });
  } catch (error) {
    res.status(400).json("Something went wrong");
    console.log(error);
  }
};
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not authorized" });
    }
    if (book.image) {
      const public_id = book.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(public_id);
    }

    await book.deleteOne();
  } catch (error) {
    res.status(400).json("Something went wrong");
    console.log(error);
  }
};

export const userBook = async (req, res) => {
    try {
        const books = await Book.findById(req.user._id)
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json("Something went wrong");
        console.log(error);
        
    }
}