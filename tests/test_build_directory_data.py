import importlib.util
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve().parents[1] / "scripts" / "build-directory-data.py"


def load_builder():
    spec = importlib.util.spec_from_file_location("build_directory_data", SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class FakeWorkbook:
    sheetnames = ["Overview", "SMA Endpoint Directory"]

    def __getitem__(self, name):
        if name not in self.sheetnames:
            raise KeyError(name)
        return name


def test_get_directory_sheet_accepts_normalized_sheet_name():
    builder = load_builder()

    assert builder.get_directory_sheet(FakeWorkbook()) == "SMA Endpoint Directory"


if __name__ == "__main__":
    test_get_directory_sheet_accepts_normalized_sheet_name()
    print("build-directory-data tests passed")
