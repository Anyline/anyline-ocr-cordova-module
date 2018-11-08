package io.anyline.cordova;

import android.content.Context;
import android.util.Log;
import android.util.SparseArray;
import android.widget.Toast;

import com.google.android.gms.vision.barcode.Barcode;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import at.nineyards.anyline.modules.barcode.BarcodeScanView;
import at.nineyards.anyline.modules.barcode.NativeBarcodeResultListener;
import at.nineyards.anyline.util.TempFileUtil;
import io.anyline.plugin.ScanResult;
import io.anyline.plugin.meter.MeterScanMode;
import io.anyline.view.ScanView;

import static org.apache.cordova.Whitelist.TAG;

public class AnylinePluginHelper {

	private static Toast notificationToast;

	public static JSONObject jsonHelper(Anyline4Activity activity, ScanResult<?> scanResult, JSONObject jsonObject) {
		try {
			File imageFile = TempFileUtil.createTempFileCheckCache(activity,
					UUID.randomUUID().toString(), ".jpg");
			scanResult.getCutoutImage().save(imageFile, 90);

			jsonObject.put("imagePath", imageFile.getAbsolutePath());

			jsonObject.put("outline", activity.jsonForOutline(scanResult.getOutline()));
			jsonObject.put("confidence", scanResult.getConfidence());

		} catch (IOException e) {
			Log.e(TAG, "Image file could not be saved.", e);

		} catch (JSONException jsonException) {
			//should not be possible
			Log.e(TAG, "Error while putting image path to json.", jsonException);
		}
		return jsonObject;
	}

//	public Pair<RelativeLayout, RelativeLayout.LayoutParams> configLayoutHelper(Context context, final ScanView anylineScanView, JSONObject json) {
//		RadioGroup radioGroup;
//		CordovaUIConfig cordovaUiConfig = new CordovaUIConfig(context, json);
//		final String scanModeString = ((MeterScanViewPlugin) anylineScanView.getScanViewPlugin()).getScanMode().toString();
//
//		final RelativeLayout relativeLayout = new RelativeLayout(context);
//
//		// Defining the RelativeLayout layout parameters.
//		// In this case I want to fill its parent
//		RelativeLayout.LayoutParams matchParentParams = new RelativeLayout.LayoutParams(
//				RelativeLayout.LayoutParams.MATCH_PARENT,
//				RelativeLayout.LayoutParams.MATCH_PARENT);
//		relativeLayout.addView(anylineScanView, matchParentParams);
//
//		ArrayList<String> titles = cordovaUiConfig.getTitles();
//		final ArrayList<String> modes = cordovaUiConfig.getModes();
//
//		if (titles != null && titles.size() > 0) {
//
//			if (titles.size() != modes.size()) {
//				Intent data = new Intent();
//				data.putExtra(AnylinePlugin.EXTRA_ERROR_MESSAGE, Resources.getString(context, "error_invalid_segment_config"));
//				setResult(AnylinePlugin.RESULT_ERROR, data);
//				finish();
//				//finishWithError(Resources.getString(context, "error_invalid_segment_config"));
//			}
//
//			RadioButton[] radioButtons = new RadioButton[titles.size()];
//			radioGroup = new RadioGroup(context);
//			radioGroup.setOrientation(RadioGroup.VERTICAL);
//
//			int currentApiVersion = android.os.Build.VERSION.SDK_INT;
//			for (int i = 0; i < titles.size(); i++) {
//				radioButtons[i] = new RadioButton(context);
//				radioButtons[i].setText(titles.get(i));
//
//				if (currentApiVersion >= Build.VERSION_CODES.LOLLIPOP) {
//					radioButtons[i].setButtonTintList(ColorStateList.valueOf(cordovaUiConfig.getTintColor()));
//				}
//
//				radioGroup.addView(radioButtons[i]);
//			}
//
//			Integer modeIndex = modes.indexOf(scanModeString);
//			RadioButton button = radioButtons[modeIndex];
//			button.setChecked(true);
//
//			radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
//				@Override
//				public void onCheckedChanged(RadioGroup group, int checkedId) {
//					View button = group.findViewById(checkedId);
//					String mode = modes.get(group.indexOfChild(button));
//					((MeterScanViewPlugin) anylineScanView.getScanViewPlugin()).setScanMode(MeterScanMode.valueOf(mode));
//					anylineScanView.start();
//				}
//			});
//
//
//			RelativeLayout.LayoutParams lp = new RelativeLayout.LayoutParams(
//					RelativeLayout.LayoutParams.WRAP_CONTENT,
//					RelativeLayout.LayoutParams.WRAP_CONTENT);
//			lp.addRule(RelativeLayout.ALIGN_PARENT_TOP);
//
//			radioGroup.setVisibility(View.INVISIBLE);
//
//			relativeLayout.addView(radioGroup, lp);
//		}
//		Pair<RelativeLayout, RelativeLayout.LayoutParams> UIConfig = new Pair<>(relativeLayout, matchParentParams);
//		return UIConfig;
//	}

	public static JSONObject wrapBarcodeInJson(Barcode b) {
		JSONObject json = new JSONObject();

		try {
			json.put("value", b.rawValue);
			json.put("format", findValidFormatForReference(b.format));
		} catch (JSONException jsonException) {
			//should not be possible
			Log.e(TAG, "Error while putting image path to json.", jsonException);
		}
		return json;
	}

	private static String findValidFormatForReference(int format) {
		if (format == Barcode.AZTEC) {
			return BarcodeScanView.BarcodeFormat.AZTEC.toString();
		}
		if (format == Barcode.CODABAR) {
			return BarcodeScanView.BarcodeFormat.CODABAR.toString();
		}
		if (format == Barcode.CODE_39) {
			return BarcodeScanView.BarcodeFormat.CODE_39.toString();
		}
		if (format == Barcode.CODE_93) {
			return BarcodeScanView.BarcodeFormat.CODE_93.toString();
		}
		if (format == Barcode.CODE_128) {
			return BarcodeScanView.BarcodeFormat.CODE_128.toString();
		}
		if (format == Barcode.DATA_MATRIX) {
			return BarcodeScanView.BarcodeFormat.DATA_MATRIX.toString();
		}
		if (format == Barcode.EAN_8) {
			return BarcodeScanView.BarcodeFormat.EAN_8.toString();
		}
		if (format == Barcode.EAN_13) {
			return BarcodeScanView.BarcodeFormat.EAN_13.toString();
		}
		if (format == Barcode.ITF) {
			return BarcodeScanView.BarcodeFormat.ITF.toString();
		}
		if (format == Barcode.PDF417) {
			return BarcodeScanView.BarcodeFormat.PDF_417.toString();
		}
		if (format == Barcode.QR_CODE) {
			return BarcodeScanView.BarcodeFormat.QR_CODE.toString();
		}
		if (format == Barcode.UPC_A) {
			return BarcodeScanView.BarcodeFormat.UPC_A.toString();
		}
		if (format == Barcode.UPC_E) {
			return BarcodeScanView.BarcodeFormat.UPC_E.toString();
		}

		//others are currently not supported by the native scanner (RSS_14, RSS_EXPANDED, UPC_EAN_EXTENSION)
		return BarcodeScanView.BarcodeFormat.UNKNOWN.toString();

	}

	public static List<Barcode> nativeBarcodeList(ScanView anylineScanView) {
		final List<Barcode> barcodeList = new ArrayList<>();
		anylineScanView.getCameraView().enableBarcodeDetection(new NativeBarcodeResultListener() {
			@Override
			public void onBarcodesReceived(SparseArray<Barcode> barcodes) {
				if (barcodes.size() > 0) {
					for (int i = 0; i < barcodes.size(); i++) {
						if (!barcodeList.contains(barcodes.valueAt(i).rawValue)) {
							barcodeList.add(barcodes.valueAt(i));
						}
					}

				}
			}
		});
		return barcodeList;
	}

	protected static void showToast(String st, Context context) {
		try {
			notificationToast.getView().isShown();
			notificationToast.setText(st);
		} catch (Exception e) {
			notificationToast = Toast.makeText(context, st, Toast.LENGTH_SHORT);
		}
		notificationToast.show();
	}

	//Meter helper
	public static JSONObject setMeterScanMode(MeterScanMode scanMode, JSONObject jsonResult) {
		try {
			switch (scanMode) {
				case DIGITAL_METER:
					jsonResult.put("meterType", "Digital Meter");
					break;
				case DIAL_METER:
					jsonResult.put("meterType", "Dial Meter");
					break;
				case ANALOG_METER:
					jsonResult.put("meterType", "Analog Meter");
					break;
				case AUTO_ANALOG_DIGITAL_METER:
					jsonResult.put("meterType", "Auto Analog Digital Meter");
					break;
				case SERIAL_NUMBER:
					jsonResult.put("meterType", "Serial Number");
					break;
				default:
					jsonResult.put("meterType", "Electric Meter");
					break;
			}

			jsonResult.put("scanMode", scanMode.toString());
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return jsonResult;
	}
}
