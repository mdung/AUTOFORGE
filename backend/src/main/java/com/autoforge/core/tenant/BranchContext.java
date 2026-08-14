package com.autoforge.core.tenant;

import java.util.UUID;

public class BranchContext {
    private static final ThreadLocal<UUID> currentBranch = new ThreadLocal<>();

    public static void setCurrentBranch(UUID branchId) {
        currentBranch.set(branchId);
    }

    public static UUID getCurrentBranch() {
        return currentBranch.get();
    }

    public static void clear() {
        currentBranch.remove();
    }
}
