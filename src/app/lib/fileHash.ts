// src/app/lib/fileHash.ts

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  
  /**
   * Calculates a SHA-256 hash of the given file.
   * Returns a hex string like "a3f9...".
   */
  export async function hashFileSHA256(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return bufferToHex(hashBuffer);
  }
  