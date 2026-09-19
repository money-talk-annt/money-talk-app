import { memo, useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../components/Text";
import { THEME } from "../../theme";
import { QUICK_TAGS, useLocketTransaction } from "./useLocketTransaction";
import { TransactionBottomSheet } from "./TransactionBottomSheet";
import { formatCurrencyInput } from "../../utils/formatCurrency";
import Box from "../../components/Box";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// Optimal balanced square viewfinder dimension
const FRAME_SIZE = Math.min(SCREEN_WIDTH - 32, SCREEN_HEIGHT * 0.44);

// Friendly Quick Tag options (matching .requirements/screen.png)

export const LocketCamera = () => {
  const {
    t,
    photoUri,
    type,
    amount,
    note,
    wallets,
    walletActive,
    setValue,
    isSubmitting,
    isShowWallet,
    handlePhotoCaptured,
    handleRetake,
    handleClose,
    handleChangeType,
    handleOpenWallet,
    handleCloseWallet,
    handleSelectWallet,
    handleSubmitTransaction,
    currencySymbol,
  } = useLocketTransaction();

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string>("food");

  const handleFlip = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  const handleToggleFlash = useCallback(() => {
    setIsTorchOn((prev) => !prev);
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
      });

      if (photo?.uri) {
        await handlePhotoCaptured(photo.uri);
        // Automatically open numpad after taking picture if amount is empty
        if (!amount || amount.trim() === "" || amount === "0") {
          setIsKeypadOpen(true);
        }
      }
    } catch (error) {
      console.error("Failed to capture photo:", error);
    } finally {
      setIsCapturing(false);
      setIsTorchOn(false);
    }
  }, [isCapturing, handlePhotoCaptured, amount]);

  const handleMainAction = useCallback(() => {
    if (!photoUri) {
      handleCapture();
    } else {
      if (!amount || amount.trim() === "" || amount === "0") {
        Alert.alert(
          t("locket.amountRequiredTitle") || "Số tiền chưa nhập",
          t("locket.amountRequiredMessage") ||
            "Vui lòng nhập số tiền cho giao dịch Locket của bạn nhé! ✨",
          [
            {
              text: t("locket.enterNow") || "Nhập ngay",
              onPress: () => setIsKeypadOpen(true),
            },
          ],
        );
        return;
      }
      handleSubmitTransaction();
    }
  }, [photoUri, amount, handleCapture, handleSubmitTransaction, t]);

  // Helper to get localized tag label
  const getTagLabel = useCallback(
    (tag: (typeof QUICK_TAGS)[number]): string => {
      const label = t(tag.labelKey as any);
      return typeof label === "string" ? label : tag.fallbackLabel;
    },
    [t],
  );

  // Handle Quick Tag selection
  const handleSelectQuickTag = useCallback(
    (tag: (typeof QUICK_TAGS)[number]) => {
      setActiveTagId(tag.id);
      const tagLabel = getTagLabel(tag);
      const autoNote = `${tagLabel} ${tag.emoji}`;
      if (!note || QUICK_TAGS.some((item) => note.includes(item.emoji))) {
        setValue("note", autoNote);
      }
    },
    [note, setValue, getTagLabel],
  );

  // Friendly Numpad Key Press handler
  const handleKeypadPress = useCallback(
    (key: string) => {
      const currentRaw = (amount || "").replaceAll(".", "").replaceAll(",", "");

      if (key === "backspace") {
        const newRaw = currentRaw.slice(0, -1);
        const formatted = newRaw ? formatCurrencyInput(newRaw) : "";
        setValue("amount", formatted, { shouldValidate: true });
        return;
      }

      if (key === "000") {
        if (!currentRaw || currentRaw === "0") return;
        if (currentRaw.length >= 10) return;
        const newRaw = currentRaw + "000";
        setValue("amount", formatCurrencyInput(newRaw), {
          shouldValidate: true,
        });
        return;
      }

      if (currentRaw.length >= 11) return;
      const newRaw = currentRaw + key;
      setValue("amount", formatCurrencyInput(newRaw), { shouldValidate: true });
    },
    [amount, setValue],
  );

  // ==================== PERMISSION SCREENS ====================
  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <SafeAreaView style={styles.permissionContent}>
          <Ionicons name="camera" size={64} color="#fff" />
          <Text type="headlineMd" color="white" style={styles.permissionTitle}>
            {t("locket.cameraPermissionTitle")}
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <SafeAreaView style={styles.permissionContent}>
          <View style={styles.permissionIconCircle}>
            <Ionicons name="camera-outline" size={48} color="#fff" />
          </View>
          <Text type="headlineMd" color="white" style={styles.permissionTitle}>
            {t("locket.cameraPermissionTitle")}
          </Text>
          <Text type="bodyMd" style={styles.permissionDesc}>
            {t("locket.cameraPermissionDesc")}
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={styles.permissionButton}
            activeOpacity={0.8}
          >
            <Text type="labelMdBold" color="white">
              {t("locket.allowCamera")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.permissionCloseBtn}
          >
            <Text type="bodyMd" style={styles.permissionCloseText}>
              {t("locket.cancel")}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // ==================== MAIN LOCKET EXPERIENCE ====================
  const isIncome = type === "income";
  const currentTag =
    QUICK_TAGS.find((t) => t.id === activeTagId) || QUICK_TAGS[0];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* 2. TOP BAR CONTROLS (COMFORTABLE & BALANCED PROPORTIONS) */}
        <View style={styles.topBar}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={styles.glassPillRound}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#e4e4e7" />
          </TouchableOpacity>

          {/* Toggle Chi tiêu / Thu nhập (Locket Style Capsule) */}
          <View style={styles.typeCapsule}>
            <TouchableOpacity
              onPress={() => handleChangeType("expense")}
              style={[styles.typeTab, !isIncome && styles.typeTabActiveExpense]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up-circle"
                size={14}
                color={!isIncome ? "#ffffff" : "#a1a1aa"}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.typeTabText,
                  !isIncome && styles.typeTabTextActive,
                ]}
              >
                {t("expense") || "Chi tiêu"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleChangeType("income")}
              style={[styles.typeTab, isIncome && styles.typeTabActiveIncome]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-down-circle"
                size={14}
                color={isIncome ? "#ffffff" : "#a1a1aa"}
                style={{ marginRight: 5 }}
              />
              <Text
                style={[
                  styles.typeTabText,
                  isIncome && styles.typeTabTextActive,
                ]}
              >
                {t("income") || "Thu nhập"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Flash Button (Physical Torch Toggle Action) */}
          {photoUri ? (
            <Box height={44} width={44} />
          ) : (
            <TouchableOpacity
              onPress={handleToggleFlash}
              style={[
                styles.glassPillRound,
                isTorchOn && styles.glassPillFlashActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isTorchOn ? "flash" : "flash-off-outline"}
                size={20}
                color={isTorchOn ? "#facc15" : "#a1a1aa"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 3. MAIN CENTRAL AREA: SQUARE VIEWFINDER */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* THE SIGNATURE SQUARE CAMERA VIEWFINDER FRAME */}
          <View style={styles.viewfinderFrame}>
            {/* Live Camera (Before capture) or Captured Photo (After capture) */}
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing={facing}
                enableTorch={isTorchOn}
                flash={isTorchOn ? "on" : "off"}
                zoom={zoom}
              />
            )}

            {/* Subtle Vignettes for High Readability (only visible after capture or subtle on live) */}
            <View
              style={photoUri ? styles.vignetteTop : styles.vignetteTopSubtle}
            />
            <View
              style={
                photoUri ? styles.vignetteBottom : styles.vignetteBottomSubtle
              }
            />

            {/* Top row inside viewfinder: Category badge & Wallet badge */}
            <View style={styles.frameTopRow}>
              {/* Category / Theme Badge (Left) - Only shown after photo is taken */}
              {photoUri ? (
                <View style={styles.frameTopBadge}>
                  <Text numberOfLines={1} style={styles.frameTopBadgeText}>
                    {`${currentTag.emoji} ${getTagLabel(currentTag)}`}
                  </Text>
                </View>
              ) : (
                /* Live Camera Guide Pill */
                <View style={styles.liveCameraPill}>
                  <Ionicons
                    name="camera-outline"
                    size={14}
                    color="#34d399"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.liveCameraPillText}>
                    {t("locket.squareFrame") || "Khung chụp 1:1"}
                  </Text>
                </View>
              )}

              {/* Wallet Badge (Right) */}
              <TouchableOpacity
                onPress={handleOpenWallet}
                style={styles.frameTopBadge}
                activeOpacity={0.8}
              >
                <View style={styles.walletDot} />
                <Text numberOfLines={1} style={styles.frameTopBadgeText}>
                  {walletActive?.name || "Momo • 4291"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color="rgba(255,255,255,0.6)"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>

            {/* Center Area: ONLY SHOWN AFTER CAPTURING PHOTO */}
            {photoUri ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsKeypadOpen(true)}
                style={styles.frameCenterArea}
              >
                <View style={styles.amountTagContainer}>
                  <Ionicons
                    name="receipt-outline"
                    size={12}
                    color="rgba(255,255,255,0.75)"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.amountHeaderLabel}>
                    {isIncome
                      ? t("locket.amountIncome") || "SỐ TIỀN THU"
                      : t("locket.amountExpense") || "SỐ TIỀN CHI"}
                  </Text>
                </View>

                <View style={styles.amountDisplayRow}>
                  <Text style={styles.amountBigNumber}>
                    {amount && amount.trim() !== "" ? amount : "0"}
                  </Text>
                  <Text style={styles.currencySign}>{currencySymbol}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              /* When Live: Center is clean with subtle crosshair center point */
              <View style={styles.frameLiveCenterGuide}>
                <View style={styles.centerAimCircle} />
              </View>
            )}

            {/* Bottom: Note Caption Pill inside viewfinder - ONLY SHOWN AFTER CAPTURING PHOTO */}
            {photoUri ? (
              <View style={styles.frameBottomArea}>
                <View style={styles.notePill}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={20}
                    color="rgba(255,255,255,0.75)"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    value={note || ""}
                    onChangeText={(val) => setValue("note", val)}
                    placeholder={
                      t("locket.notePlaceholder") || "Thêm ghi chú giao dịch..."
                    }
                    placeholderTextColor="rgba(255, 255, 255, 0.45)"
                    style={styles.noteInput}
                    maxLength={255}
                  />
                </View>
              </View>
            ) : (
              /* When Live: Zoom controls & Framing Hint */
              <View style={styles.liveBottomHint}>
                {/* Modern Sleek Zoom Pill (1x / 2x) */}
                <View style={styles.zoomControlRow}>
                  <TouchableOpacity
                    onPress={() => setZoom(0)}
                    style={[
                      styles.zoomPillBtn,
                      zoom === 0 && styles.zoomPillBtnActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.zoomText,
                        zoom === 0 && styles.zoomTextActive,
                      ]}
                    >
                      1x
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setZoom(0.25)}
                    style={[
                      styles.zoomPillBtn,
                      zoom > 0 && styles.zoomPillBtnActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.zoomText,
                        zoom > 0 && styles.zoomTextActive,
                      ]}
                    >
                      2x
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.liveBottomHintText}>
                  {t("locket.framingHint") ||
                    "Căn chỉnh khung hình & bấm nút chụp"}
                </Text>
              </View>
            )}
          </View>

          {/* QUICK CATEGORY CAROUSEL - ONLY SHOWN AFTER CAPTURING PHOTO */}
          {photoUri ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickTagsScroll}
              style={{
                flexGrow: 0,
              }}
            >
              {QUICK_TAGS.map((tag) => {
                const isSelected = activeTagId === tag.id;
                return (
                  <TouchableOpacity
                    key={tag.id}
                    onPress={() => handleSelectQuickTag(tag)}
                    style={[
                      styles.quickTagChip,
                      isSelected && styles.quickTagChipActive,
                    ]}
                    activeOpacity={0.75}
                  >
                    <Text style={{ fontSize: 13, marginRight: 5 }}>
                      {tag.emoji}
                    </Text>
                    <Text
                      style={[
                        styles.quickTagText,
                        isSelected && styles.quickTagTextActive,
                      ]}
                    >
                      {getTagLabel(tag)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={{ height: 16 }} />
          )}
        </ScrollView>

        {/* 4. BOTTOM ACTION CONTROLS */}
        <View style={styles.bottomBar}>
          {/* Left Action: Hóa đơn (Before capture) or Chụp lại (After capture) */}
          <View style={styles.sideControl}>
            {photoUri && (
              <TouchableOpacity
                onPress={handleRetake}
                style={styles.sideActionBtn}
                activeOpacity={0.75}
              >
                <View style={styles.sideIconCard}>
                  <Ionicons name="refresh" size={22} color="#e4e4e7" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* The Iconic Big Shutter Button */}
          <View style={styles.shutterCenter}>
            <View style={styles.shutterAura}>
              <View style={styles.shutterWhiteRing}>
                <TouchableOpacity
                  onPress={handleMainAction}
                  activeOpacity={0.85}
                  disabled={isCapturing || isSubmitting}
                  style={[
                    styles.shutterInner,
                    photoUri ? styles.shutterSendInner : null,
                  ]}
                >
                  <Ionicons
                    name={photoUri ? "paper-plane" : "camera"}
                    size={28}
                    color="#ffffff"
                    style={
                      photoUri
                        ? {
                            transform: [
                              { rotate: "0deg" },
                              { translateX: 1 },
                              { translateY: -1 },
                            ],
                          }
                        : undefined
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Right Action: Đổi cam (Before capture) or Bàn phím (After capture) */}
          <View style={styles.sideControl}>
            {photoUri ? (
              <TouchableOpacity
                onPress={() => setIsKeypadOpen(true)}
                style={styles.sideActionBtn}
                activeOpacity={0.75}
              >
                <View style={styles.sideIconCard}>
                  <Ionicons
                    name="calculator-outline"
                    size={22}
                    color="#e4e4e7"
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleFlip}
                style={styles.sideActionBtn}
                activeOpacity={0.75}
              >
                <View style={styles.sideIconCard}>
                  <Ionicons
                    name="camera-reverse-outline"
                    size={22}
                    color="#e4e4e7"
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* FRIENDLY NUMERIC KEYPAD BOTTOM SHEET */}
      <Modal visible={isKeypadOpen} transparent animationType="slide">
        <View style={styles.keypadBackdrop}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setIsKeypadOpen(false)}
            activeOpacity={1}
          />

          <View style={styles.keypadSheet}>
            {/* Sheet Handle */}
            <View style={styles.sheetHandle} />

            {/* Keypad Header */}
            <View style={styles.keypadHeader}>
              <View>
                <Text style={styles.keypadHeaderTitle}>
                  {isIncome
                    ? t("locket.amountIncomeTitle") || "Số tiền thu"
                    : t("locket.amountExpenseTitle") || "Số tiền chi"}
                </Text>
                <Text style={styles.keypadCurrentAmount}>
                  {amount && amount.trim() !== "" ? amount : "0"}{" "}
                  {currencySymbol}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setIsKeypadOpen(false)}
                style={styles.keypadDoneBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.keypadDoneText}>
                  {t("locket.done") || "Xong"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Number Keys Grid */}
            <View style={styles.keysGrid}>
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "000",
                "0",
                "backspace",
              ].map((k) => (
                <TouchableOpacity
                  key={k}
                  onPress={() => handleKeypadPress(k)}
                  style={[
                    styles.numKey,
                    k === "backspace" && styles.numKeySpecial,
                  ]}
                  activeOpacity={0.65}
                >
                  {k === "backspace" ? (
                    <Ionicons
                      name="backspace-outline"
                      size={22}
                      color="#ffffff"
                    />
                  ) : (
                    <Text style={styles.numKeyText}>{k}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Wallet Selector Bottom Sheet */}
      <TransactionBottomSheet
        t={t}
        isOpen={isShowWallet}
        onClose={handleCloseWallet}
        data={wallets}
        onSelect={(id) => handleSelectWallet(id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0c0d14",
  },
  safeArea: {
    flex: 1,
  },

  // 1. Top Status Row (Generous spacing & breathing room)
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: Platform.OS === "android" ? 12 : 8,
    paddingBottom: 8,
  },
  statusTime: {
    fontSize: 13,
    fontWeight: "700",
    color: "#a1a1aa",
    letterSpacing: 0.5,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.35)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34d399",
    marginRight: 6,
  },
  livePillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#34d399",
    letterSpacing: 0.9,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // 2. Top Bar Navigation (Comfortable sizing, not cramped)
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 8,
    zIndex: 20,
  },
  glassPillRound: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(26, 28, 35, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  glassPillFlashActive: {
    backgroundColor: "rgba(250, 204, 21, 0.2)",
    borderColor: "rgba(250, 204, 21, 0.5)",
  },
  typeCapsule: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 28, 35, 0.85)",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
  },
  typeTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  typeTabActiveExpense: {
    backgroundColor: "#5d5fef",
    shadowColor: "#5d5fef",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  typeTabActiveIncome: {
    backgroundColor: THEME.colors.secondary,
    shadowColor: THEME.colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  typeTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#a1a1aa",
  },
  typeTabTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },

  // 3. Central Viewfinder Area (Centered on screen)
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 8,
  },

  // Viewfinder Square Frame
  viewfinderFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#13141a",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.14)",
    position: "relative",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 30,
    elevation: 16,
  },
  vignetteTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  vignetteTopSubtle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  vignetteBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  vignetteBottomSubtle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  // Top Row Inside Viewfinder (Spacious Badges)
  frameTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  frameTopBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 28, 35, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    maxWidth: 160,
  },
  liveCameraPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10, 12, 18, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.35)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  liveCameraPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#34d399",
  },
  categoryIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(245, 158, 11, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  walletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#818cf8",
    marginRight: 7,
  },
  frameTopBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Center Amount Area (Grand, centered & prominent - only after capture)
  frameCenterArea: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    paddingVertical: 12,
  },
  frameLiveCenterGuide: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  centerAimCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
  },
  amountTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  amountHeaderLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.75)",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 6,
  },
  amountDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 64,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  amountBigNumber: {
    fontSize: 48,
    lineHeight: 58,
    includeFontPadding: false,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
  currencySign: {
    fontSize: 28,
    lineHeight: 38,
    includeFontPadding: false,
    fontWeight: "800",
    color: "#ffffff",
    marginLeft: 6,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 6,
  },

  // Bottom Note Pill Inside Viewfinder
  frameBottomArea: {
    width: "100%",
    zIndex: 10,
    paddingBottom: 2,
  },
  liveBottomHint: {
    alignItems: "center",
    paddingBottom: 6,
    zIndex: 5,
  },
  zoomControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 12, 18, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 3,
    marginBottom: 8,
    gap: 4,
  },
  zoomPillBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomPillBtnActive: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  zoomText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
  },
  zoomTextActive: {
    color: "#facc15",
  },
  liveBottomHintText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.55)",
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowRadius: 4,
    marginTop: 8,
  },
  notePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(12, 14, 22, 0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 52,
  },
  noteInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  friendAvatarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarOverlap: {
    marginLeft: -7,
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#ffffff",
  },
  miniAvatarPlus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#27272a",
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarPlusText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#d4d4d8",
  },

  // Quick Tags Carousel under frame (Compact & refined)
  quickTagsScroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
    flexGrow: 0,
  },
  quickTagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 28, 35, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 15,
    paddingHorizontal: 11,
    height: 30,
  },
  quickTagChipActive: {
    backgroundColor: "rgba(93, 95, 239, 0.35)",
    borderColor: "rgba(93, 95, 239, 0.7)",
  },
  quickTagText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#a1a1aa",
  },
  quickTagTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },

  // 4. Bottom Action Controls Bar (Shifted up with comfortable spacing)
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 22,
    paddingTop: 4,
    paddingBottom: Platform.OS === "ios" ? 24 : 18,
    marginBottom: 8,
  },
  sideControl: {
    width: 68,
    alignItems: "center",
  },
  sideActionBtn: {
    alignItems: "center",
    gap: 4,
  },
  sideIconCard: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: "rgba(26, 28, 35, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  sideActionText: {
    fontSize: 11,
    color: "#a1a1aa",
    fontWeight: "600",
    marginTop: 2,
  },

  // The Grand Shutter Button
  shutterCenter: {
    alignItems: "center",
  },
  shutterAura: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(93, 95, 239, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterWhiteRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3.5,
    borderColor: "rgba(255, 255, 255, 0.95)",
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: "100%",
    height: "100%",
    borderRadius: 36,
    backgroundColor: "#5d5fef",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5d5fef",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  shutterSendInner: {
    backgroundColor: "#4e50e5",
  },
  shutterPromptText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // 5. Recipient / Wallet Widget Bar
  recipientBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 22,
    marginTop: 4,
    marginBottom: Platform.OS === "ios" ? 8 : 16,
    backgroundColor: "rgba(26, 28, 35, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  recipientLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  recipientLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#a1a1aa",
  },
  recipientValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Friendly Keypad Modal
  keypadBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  keypadSheet: {
    backgroundColor: "#161722",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "center",
    marginBottom: 14,
  },
  keypadHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  keypadHeaderTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a1a1aa",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  keypadCurrentAmount: {
    fontSize: 28,
    lineHeight: 36,
    includeFontPadding: false,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 2,
  },
  keypadDoneBtn: {
    backgroundColor: "#5d5fef",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
  },
  keypadDoneText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  keysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  numKey: {
    width: "31%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  numKeySpecial: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  numKeyText: {
    fontSize: 24,
    lineHeight: 30,
    includeFontPadding: false,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  // Permissions
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0c0d14",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  permissionIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  permissionTitle: {
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  permissionDesc: {
    textAlign: "center",
    color: "#a1a1aa",
    marginBottom: 24,
  },
  permissionButton: {
    width: "100%",
    backgroundColor: "#5d5fef",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  permissionCloseBtn: {
    marginTop: 16,
    padding: 8,
  },
  permissionCloseText: {
    color: "#a1a1aa",
  },
});

export const LocketCameraScreen = LocketCamera;
export default LocketCamera;
