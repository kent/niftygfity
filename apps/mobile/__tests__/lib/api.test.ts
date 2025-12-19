import { apiClient, holidaysService, giftsService, giftStatusesService } from "@/lib/api";

describe("API Client", () => {
  it("exports apiClient instance", () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe("function");
    expect(typeof apiClient.post).toBe("function");
    expect(typeof apiClient.patch).toBe("function");
    expect(typeof apiClient.delete).toBe("function");
  });

  it("exports holidaysService", () => {
    expect(holidaysService).toBeDefined();
    expect(typeof holidaysService.getAll).toBe("function");
    expect(typeof holidaysService.getById).toBe("function");
    expect(typeof holidaysService.create).toBe("function");
    expect(typeof holidaysService.update).toBe("function");
    expect(typeof holidaysService.delete).toBe("function");
  });

  it("exports giftsService", () => {
    expect(giftsService).toBeDefined();
    expect(typeof giftsService.getAll).toBe("function");
    expect(typeof giftsService.getById).toBe("function");
    expect(typeof giftsService.create).toBe("function");
    expect(typeof giftsService.update).toBe("function");
    expect(typeof giftsService.delete).toBe("function");
  });

  it("exports giftStatusesService", () => {
    expect(giftStatusesService).toBeDefined();
    expect(typeof giftStatusesService.getAll).toBe("function");
    expect(typeof giftStatusesService.getById).toBe("function");
    expect(typeof giftStatusesService.create).toBe("function");
    expect(typeof giftStatusesService.update).toBe("function");
    expect(typeof giftStatusesService.delete).toBe("function");
  });
});
