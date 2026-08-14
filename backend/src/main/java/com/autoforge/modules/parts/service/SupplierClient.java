package com.autoforge.modules.parts.service;

import com.autoforge.modules.parts.model.Part;
import java.util.List;

public interface SupplierClient {
    List<Part> searchMarketplaceParts(String query);
}
