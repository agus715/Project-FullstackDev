<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index() {
        return response()->json(Product::all(), 200);
    }

    public function store(Request $request) {
        $request->validate([
            'product_name' => 'required|max:150',
            'category' => 'required|max:100',
            'price' => 'required|numeric',
            'discount' => 'nullable|numeric',
        ]);

        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function show($id) {
        $product = Product::find($id);
        if ($product) {
            return response()->json($product, 200);
        }
        return response()->json(['error' => 'Product not found'], 404);
    }

    public function update(Request $request, $id) {
        $request->validate([
            'product_name' => 'sometimes|required|max:150',
            'category' => 'sometimes|required|max:100',
            'price' => 'sometimes|required|numeric',
            'discount' => 'nullable|numeric',
        ]);

        $product = Product::find($id);
        if ($product) {
            $product->update($request->all());
            return response()->json($product, 200);
        }
        return response()->json(['error' => 'Product not found'], 404);
    }

    public function destroy($id) {
        $product = Product::find($id);
        if ($product) {
            $product->delete();
            return response()->json(['message' => 'Product deleted'], 200);
        }
        return response()->json(['error' => 'Product not found'], 404);
    }
}
