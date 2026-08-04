class ApiResponse {
  static success(res, data = {}, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static paginate(res, data = [], page = 1, limit = 20, total = 0, message = 'Success', statusCode = 200) {
    const totalPages = Math.ceil(total / limit);
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(total),
        totalPages,
      },
    });
  }
}

module.exports = ApiResponse;
