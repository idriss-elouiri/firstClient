import Distribution from "./distribution.model.js";

// Add a new distribution
export const addDistribution = async (req, res, next) => {
  try {
    const { date, quantity, store, status } = req.body;

    const newDistribution = new Distribution({
      date,
      quantity,
      store,
      status,
    });

    const savedDistribution = await newDistribution.save();
    res.status(201).json(savedDistribution);
  } catch (error) {
    next(error);
  }
};

// Get all distributions
export const getDistributions = async (req, res, next) => {
  try {
    const distributions = await Distribution.find();
    res.status(200).json(distributions);
  } catch (error) {
    next(error);
  }
};

// Update a distribution
export const updateDistribution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedDistribution = await Distribution.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedDistribution) {
      return res.status(404).json({ message: "Distribution not found" });
    }

    res.status(200).json(updatedDistribution);
  } catch (error) {
    next(error);
  }
};

// Delete a distribution
export const deleteDistribution = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedDistribution = await Distribution.findByIdAndDelete(id);

    if (!deletedDistribution) {
      return res.status(404).json({ message: "Distribution not found" });
    }

    res.status(200).json({ message: "Distribution deleted successfully" });
  } catch (error) {
    next(error);
  }
};
